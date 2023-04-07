-- CreateTable
CREATE TABLE "Team" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "destroyedAt" TIMESTAMP(3),

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "githubUsername" TEXT NOT NULL,
    "teamId" INTEGER,
    "isLeader" BOOLEAN NOT NULL DEFAULT false,
    "destroyedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "description" TEXT,
    "previousId" TEXT,
    "destroyedAt" TIMESTAMP(3),
    "isLeaderAssigned" BOOLEAN NOT NULL DEFAULT false,
    "isNonLeaderAssigned" BOOLEAN NOT NULL DEFAULT false,
    "requiredSolvedUserCount" INTEGER NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProblemToUser" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ProblemToTeam" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProblemToUser_AB_unique" ON "_ProblemToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProblemToUser_B_index" ON "_ProblemToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProblemToTeam_AB_unique" ON "_ProblemToTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_ProblemToTeam_B_index" ON "_ProblemToTeam"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_previousId_fkey" FOREIGN KEY ("previousId") REFERENCES "Problem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemToUser" ADD CONSTRAINT "_ProblemToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemToUser" ADD CONSTRAINT "_ProblemToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemToTeam" ADD CONSTRAINT "_ProblemToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemToTeam" ADD CONSTRAINT "_ProblemToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
