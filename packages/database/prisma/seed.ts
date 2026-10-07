import { PrismaClient, BodyPart } from "@prisma/client";

const prisma = new PrismaClient();

const exerciseSeedData: Record<
  BodyPart,
  { name: string; isStandard: boolean }[]
> = {
  CHEST: [
    { name: "Barbell Bench Press", isStandard: true },
    { name: "Incline Dumbbell Press", isStandard: true },
    { name: "Chest Flys", isStandard: true },
    { name: "Dips (Chest Focus)", isStandard: false },
    { name: "Push-Ups", isStandard: false },
    { name: "Decline Barbell Press", isStandard: false },
    { name: "Cable Crossover", isStandard: false },
    { name: "Dumbbell Pullover", isStandard: false },
    { name: "Machine Chest Press", isStandard: false },
    { name: "Pec Deck Fly", isStandard: false },
  ],
  BACK: [
    { name: "Barbell Deadlift", isStandard: true },
    { name: "Pull-Ups", isStandard: true },
    { name: "Barbell Bent-Over Row", isStandard: true },
    { name: "Lat Pulldown", isStandard: true },
    { name: "Seated Cable Row", isStandard: false },
    { name: "Dumbbell Single-Arm Row", isStandard: false },
    { name: "T-Bar Row", isStandard: false },
    { name: "Hyperextensions", isStandard: false },
    { name: "Face Pulls", isStandard: false },
    { name: "Straight-Arm Lat Pulldown", isStandard: false },
  ],
  LEGS: [
    { name: "Barbell Back Squat", isStandard: true },
    { name: "Romanian Deadlift", isStandard: true },
    { name: "Leg Press", isStandard: true },
    { name: "Walking Lunges", isStandard: false },
    { name: "Leg Extensions", isStandard: false },
    { name: "Seated Leg Curl", isStandard: false },
    { name: "Bulgarian Split Squat", isStandard: false },
    { name: "Standing Calf Raises", isStandard: false },
    { name: "Hack Squat", isStandard: false },
    { name: "Hip Thrusts", isStandard: false },
  ],
  SHOULDERS: [
    { name: "Overhead Barbell Press", isStandard: true },
    { name: "Dumbbell Lateral Raise", isStandard: true },
    { name: "Seated Dumbbell Shoulder Press", isStandard: true },
    { name: "Front Dumbbell Raise", isStandard: false },
    { name: "Reverse Pec Deck Fly (Rear Delt)", isStandard: false },
    { name: "Upright Rows", isStandard: false },
    { name: "Arnold Press", isStandard: false },
    { name: "Cable Lateral Raise", isStandard: false },
    { name: "Dumbbell Shrugs", isStandard: false },
    { name: "Bent-Over Rear Delt Fly", isStandard: false },
  ],
  BICEPS: [
    { name: "Barbell Bicep Curl", isStandard: true },
    { name: "Dumbbell Hammer Curl", isStandard: true },
    { name: "EZ-Bar Preacher Curl", isStandard: true },
    { name: "Incline Dumbbell Curl", isStandard: true },
    { name: "Concentration Curl", isStandard: false },
    { name: "Cable Bicep Curl", isStandard: false },
    { name: "Reverse Barbell Curl", isStandard: false },
    { name: "Zottman Curl", isStandard: false },
    { name: "Spider Curl", isStandard: false },
    { name: "High Cable Curl", isStandard: false },
  ],
  TRICEPS: [
    { name: "Tricep Rope Pushdown", isStandard: true },
    { name: "Skull Crushers", isStandard: true },
    { name: "Close-Grip Bench Press", isStandard: true },
    { name: "Overhead Tricep Extension", isStandard: true },
    { name: "Tricep Dips", isStandard: false },
    { name: "Dumbbell Kickbacks", isStandard: false },
    { name: "Cable Single-Arm Pushdown", isStandard: false },
    { name: "JM Press", isStandard: false },
    { name: "Diamond Push-Ups", isStandard: false },
    { name: "Tate Press", isStandard: false },
  ],
  CORE: [
    { name: "Hanging Leg Raise", isStandard: true },
    { name: "Ab Wheel Rollout", isStandard: true },
    { name: "Plank", isStandard: true },
    { name: "Cable Crunch", isStandard: false },
    { name: "Russian Twists", isStandard: false },
    { name: "Bicycle Crunches", isStandard: false },
    { name: "Decline Sit-Up", isStandard: false },
    { name: "Bird Dog", isStandard: false },
    { name: "Dead Bug", isStandard: false },
    { name: "Woodchoppers", isStandard: false },
  ],
  FULL_BODY: [
    { name: "Barbell Clean and Press", isStandard: true },
    { name: "Kettlebell Swings", isStandard: true },
    { name: "Burpees", isStandard: true },
    { name: "Thrusters", isStandard: false },
    { name: "Snatch", isStandard: false },
    { name: "Medicine Ball Slams", isStandard: false },
    { name: "Bear Crawls", isStandard: false },
    { name: "Farmer's Walk", isStandard: false },
    { name: "Turkish Get-Up", isStandard: false },
    { name: "Man Makers", isStandard: false },
  ],
};

async function main() {
  console.log("Starting seed process...");

  for (const [bodyPart, exercises] of Object.entries(exerciseSeedData)) {
    for (const exercise of exercises) {
      await prisma.exercise.upsert({
        where: {
          id: `seed-${bodyPart.toLowerCase()}-${exercise.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        },
        update: {
          name: exercise.name,
          bodyPart: bodyPart as BodyPart,
          isStandard: exercise.isStandard,
        },
        create: {
          id: `seed-${bodyPart.toLowerCase()}-${exercise.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          name: exercise.name,
          bodyPart: bodyPart as BodyPart,
          isStandard: exercise.isStandard,
        },
      });
    }
  }

  console.log("Database successfully seeded with popular exercises!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
