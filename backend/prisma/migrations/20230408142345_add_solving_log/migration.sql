-- CreateTable
CREATE TABLE "SolvingLog" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "problemId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SolvingLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SolvingLog" ADD CONSTRAINT "SolvingLog_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolvingLog" ADD CONSTRAINT "SolvingLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
