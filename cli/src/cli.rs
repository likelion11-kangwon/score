use clap::{ArgAction, Parser, Subcommand};

#[derive(Parser)]
pub struct Cli {
    #[command(subcommand)]
    pub command: Commands,
}

#[derive(Subcommand)]
pub enum Commands {
    User {
        #[command(subcommand)]
        command: UserCommands,
    },
    Team {
        #[command(subcommand)]
        command: TeamCommands,
    },
    Problem {
        #[command(subcommand)]
        command: ProblemCommands,
    },
}

#[derive(Subcommand)]
pub enum UserCommands {
    #[command(about = "사용자 목록을 불러옵니다.")]
    List,
    #[command(about = "사용자를 생성합니다.")]
    Create {
        name: String,
        github_username: String,
        #[arg(long, short)]
        team_id: Option<i32>,
    },
    #[command(about = "사용자를 제거합니다.")]
    Destroy { id: i32 },
}

#[derive(Subcommand)]
pub enum TeamCommands {
    #[command(about = "팀 목록을 불러옵니다.")]
    List,
    #[command(about = "팀을 생성합니다")]
    Create { id: i32, name: String },
    #[command(about = "팀을 제거합니다")]
    Destroy { id: i32 },
    User {
        #[arg(long, short)]
        team_id: i32,
        #[command(subcommand)]
        command: TeamUserCommands,
    },
}

#[derive(Subcommand)]
pub enum TeamUserCommands {
    #[command(about = "팀의 사용자 목록을 불러옵니다.")]
    List,
    #[command(about = "팀에 사용자를 추가합니다.")]
    Add {
        user_id: i32,
        #[arg(long = "is-leader", short = 'l', action=ArgAction::SetTrue)]
        is_leader: bool,
    },
    #[command(about = "팀에서 사용자를 제거합니다.")]
    Remove { user_id: i32 },
}

#[derive(Subcommand)]
pub enum ProblemCommands {
    #[command(about = "문제 목록을 불러옵니다.")]
    List,
}
