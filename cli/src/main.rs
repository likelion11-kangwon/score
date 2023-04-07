mod cli;
mod db;

use anyhow::Result;
use clap::Parser;
use cli::*;
use db::connect;
use dotenv::dotenv;
use futures::future::join_all;
use prettytable::{row, Table};
use sqlx::{Pool, Postgres};

struct Program {
    pub pool: Pool<Postgres>,
}

impl Program {
    async fn list_users(&self) -> Result<()> {
        let users = sqlx::query!(r#"select * from "User" where "destroyedAt" is null"#)
            .fetch_all(&self.pool)
            .await?;

        let mut table = Table::new();
        table.add_row(row!["id", "name", "github_username", "team_id"]);

        for user in users {
            table.add_row(row![
                user.id,
                user.name,
                user.githubUsername,
                user.teamId
                    .map(|id| id.to_string())
                    .unwrap_or("NULL".to_string())
            ]);
        }

        table.printstd();

        Ok(())
    }

    async fn create_user(
        &self,
        name: String,
        github_username: String,
        team_id: Option<i32>,
    ) -> Result<()> {
        let result = sqlx::query!(
            r#"insert into "User" (name, "githubUsername", "teamId") values ($1, $2, $3) returning id"#,
            name,
            github_username,
            team_id
        )
        .fetch_one(&self.pool)
        .await?;

        println!("사용자({})를 생성했습니다.", result.id);
        Ok(())
    }

    async fn destroy_user(&self, id: i32) -> Result<()> {
        sqlx::query!(r#"update "User" set "destroyedAt"=now() where id=$1"#, id)
            .execute(&self.pool)
            .await?;

        println!("사용자({})를 제거했습니다.", id);
        Ok(())
    }

    async fn list_teams(&self) -> Result<()> {
        let teams = sqlx::query!(r#"select * from "Team" where "destroyedAt" is null"#)
            .fetch_all(&self.pool)
            .await?;

        let teams = join_all(teams.iter().map(|team| async move {
            let score = sqlx::query!(
                r#"
                    select coalesce(sum(p.score), 0) "score"
                    from "_ProblemToTeam" tp
                    inner join "Problem" p on p.id=tp."A"
                    inner join "Team" t on t.id=tp."B"
                    where t.id=$1
                "#,
                team.id,
            )
            .fetch_one(&self.pool)
            .await?;

            Ok((
                team,
                score.score.ok_or(anyhow::format_err!("query failure"))?,
            ))
        }))
        .await;

        let teams: Vec<_> = teams.into_iter().collect::<Result<_>>()?;

        let mut table = Table::new();
        table.add_row(row!["id", "score"]);

        for (team, score) in teams {
            table.add_row(row![team.id, score]);
        }

        table.printstd();

        Ok(())
    }

    async fn create_team(&self, id: i32, name: String) -> Result<()> {
        sqlx::query!(r#"insert into "Team"(id, name) values ($1, $2)"#, id, name)
            .execute(&self.pool)
            .await?;
        println!("팀({})을 생성했습니다.", id);
        Ok(())
    }

    async fn destroy_team(&self, id: i32) -> Result<()> {
        sqlx::query!(r#"update "Team" set "destroyedAt"=now() where id=$1"#, id)
            .execute(&self.pool)
            .await?;
        println!("팀({})을 제거했습니다.", id);
        Ok(())
    }

    async fn list_team_users(&self, team_id: i32) -> Result<()> {
        let users = sqlx::query!(
            r#"select * from "User" where "destroyedAt" is null and "teamId"=$1"#,
            team_id
        )
        .fetch_all(&self.pool)
        .await?;

        let mut table = Table::new();
        table.add_row(row!["is_leader", "id", "name", "github_username"]);

        for user in users {
            table.add_row(row![user.isLeader, user.id, user.name, user.githubUsername]);
        }

        table.printstd();

        Ok(())
    }

    async fn add_user_to_team(&self, team_id: i32, user_id: i32, is_leader: bool) -> Result<()> {
        sqlx::query!(
            r#"update "User" set "teamId"=$1, "isLeader"=$2 where id=$3"#,
            team_id,
            is_leader,
            user_id
        )
        .execute(&self.pool)
        .await?;
        println!("사용자({})를 팀({})에 추가했습니다.", user_id, team_id);
        Ok(())
    }

    async fn remove_user_from_team(&self, user_id: i32) -> Result<()> {
        sqlx::query!(
            r#"update "User" set "teamId"=null, "isLeader"=false where id=$1"#,
            user_id
        )
        .execute(&self.pool)
        .await?;
        println!("사용자({})를 팀에서 제거했습니다.", user_id);
        Ok(())
    }

    async fn list_problems(&self) -> Result<()> {
        let problems = sqlx::query!(r#"select * from "Problem" where "destroyedAt" is null"#)
            .fetch_all(&self.pool)
            .await?;

        let mut table = Table::new();
        table.add_row(row![
            "id",
            "score",
            "description",
            "previous_id",
            "is_leader_assigned"
        ]);

        for problem in problems {
            table.add_row(row![
                problem.id,
                problem.score,
                problem.description.unwrap_or("NULL".to_string()),
                problem
                    .previousId
                    .map(|i| { i.to_string() })
                    .unwrap_or("NULL".to_string()),
                problem.isLeaderAssigned
            ]);
        }

        table.printstd();

        Ok(())
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    dotenv().ok();

    let pool = connect().await?;

    let program = Program { pool };

    match cli.command {
        Commands::User { command } => match command {
            UserCommands::List => program.list_users().await,
            UserCommands::Create {
                name,
                github_username,
                team_id,
            } => program.create_user(name, github_username, team_id).await,
            UserCommands::Destroy { id } => program.destroy_user(id).await,
        },
        Commands::Team { command } => match command {
            TeamCommands::List => program.list_teams().await,
            TeamCommands::Create { id, name } => program.create_team(id, name).await,
            TeamCommands::Destroy { id } => program.destroy_team(id).await,
            TeamCommands::User { command, team_id } => match command {
                TeamUserCommands::List => program.list_team_users(team_id).await,
                TeamUserCommands::Add { user_id, is_leader } => {
                    program.add_user_to_team(team_id, user_id, is_leader).await
                }
                TeamUserCommands::Remove { user_id } => {
                    program.remove_user_from_team(user_id).await
                }
            },
        },
        Commands::Problem { command } => match command {
            ProblemCommands::List => program.list_problems().await,
        },
    }?;

    Ok(())
}
