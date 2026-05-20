import prisma from "./prisma";
import { startOfDay, subDays, isSameDay } from "date-fns";

export const XP_CONFIG = {
  NEW_ENTRY: 50,
  HABIT_COMPLETED: 10,
  DAILY_STREAK_BONUS: 20,
};

export function calculateLevel(xp: number) {
  // Simple level formula: L = floor(sqrt(XP / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export async function updateUserStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, level: true, currentStreak: true },
  });

  if (!user) return;

  // Calculate Streak
  const lastEntries = await prisma.diaryEntry.findMany({
    where: { userId },
    select: { entryDate: true },
    orderBy: { entryDate: 'desc' },
    distinct: ['entryDate'],
  });

  let streak = 0;
  if (lastEntries.length > 0) {
    const today = startOfDay(new Date());
    let currentDate = today;
    
    // Check if the latest entry is today or yesterday
    const latestEntryDate = startOfDay(new Date(lastEntries[0].entryDate));
    const diffDays = Math.floor((today.getTime() - latestEntryDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays <= 1) {
      for (const entry of lastEntries) {
        const entryDate = startOfDay(new Date(entry.entryDate));
        const diff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 3600 * 24));
        
        if (diff <= 1) {
          streak++;
          currentDate = entryDate;
        } else {
          break;
        }
      }
    }
  }

  // Update XP based on entries and habits (this is a simplified logic for now)
  // In a real app, we'd add XP at the moment of the action.
  // Here we just ensure level is correct based on current XP.
  const newLevel = calculateLevel(user.xp);

  await prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak: streak,
      level: newLevel,
    },
  });

  return { streak, level: newLevel, xp: user.xp };
}

export async function addXP(userId: string, amount: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, level: true },
  });

  if (!user) return;

  const newXP = user.xp + amount;
  const newLevel = calculateLevel(newXP);

  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXP,
      level: newLevel,
    },
  });

  // If leveled up, create a notification
  if (newLevel > user.level) {
    await prisma.notification.create({
      data: {
        userId,
        title: "Level Up!",
        message: `Congratulations! You've reached Level ${newLevel}!`,
        type: "achievement",
      },
    });
  }

  return { xp: newXP, level: newLevel };
}
