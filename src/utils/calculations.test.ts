import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateRecommendedWater,
  calculateMacros,
  calculateLevelFromXp,
  calculateLifeOSIndex
} from './calculations';

test('BMI calculation: handles standard height and weight accurately', () => {
  // Height: 175cm, Weight: 68kg => BMI = 68 / (1.75^2) = 22.2
  const res = calculateBMI(68, 175);
  assert.equal(res.bmi, 22.2);
  assert.equal(res.category, 'Normal');
  assert.equal(res.healthyWeightRange.min > 50, true);
  assert.equal(res.healthyWeightRange.max < 80, true);
});

test('BMI calculation: identifies underweight and overweight thresholds', () => {
  const under = calculateBMI(45, 170);
  assert.equal(under.category, 'Underweight');

  const over = calculateBMI(85, 170);
  assert.equal(over.category, 'Overweight');

  const invalid = calculateBMI(0, 0);
  assert.equal(invalid.bmi, 0);
});

test('BMR calculation: applies Mifflin-St Jeor formula correctly for male and female', () => {
  // Weight: 70kg, Height: 175cm, Age: 25
  // Male: 10*70 + 6.25*175 - 5*25 + 5 = 700 + 1093.75 - 125 + 5 = 1673.75 => 1674
  const maleBmr = calculateBMR(70, 175, 25, 'male');
  assert.equal(maleBmr, 1674);

  // Female: 700 + 1093.75 - 125 - 161 = 1507.75 => 1508
  const femaleBmr = calculateBMR(70, 175, 25, 'female');
  assert.equal(femaleBmr, 1508);
});

test('TDEE calculation: scales BMR according to activity multiplier', () => {
  const bmr = 1600;
  assert.equal(calculateTDEE(bmr, 'sedentary'), Math.round(1600 * 1.2));
  assert.equal(calculateTDEE(bmr, 'moderate'), Math.round(1600 * 1.55));
  assert.equal(calculateTDEE(bmr, 'very_active'), Math.round(1600 * 1.9));
});

test('Water intake calculation: outputs realistic recommendations', () => {
  const waterModerate = calculateRecommendedWater(65, 'moderate');
  // 65 * 35 = 2275 + 300 = 2575 => rounded to 2600
  assert.equal(waterModerate, 2600);
});

test('Macro split calculation: adjusts based on lose_fat vs gain_muscle', () => {
  const tdee = 2000;
  const fatLoss = calculateMacros(tdee, 'lose_fat');
  assert.equal(fatLoss.calories < tdee, true);
  assert.equal(fatLoss.proteinGrams > 0, true);

  const muscleGain = calculateMacros(tdee, 'gain_muscle');
  assert.equal(muscleGain.calories > tdee, true);
});

test('XP Level Progression: advances through levels with correct bounds', () => {
  const l1 = calculateLevelFromXp(100);
  assert.equal(l1.level, 1);
  assert.equal(l1.progressPercent > 0, true);

  const l2 = calculateLevelFromXp(350);
  assert.equal(l2.level, 2);

  const l10 = calculateLevelFromXp(15000);
  assert.equal(l10.level >= 10, true);
});

test('Life OS Index: computes weighted composite score 0-100', () => {
  const perfect = calculateLifeOSIndex({
    tasksRatio: 1.0,
    waterRatio: 1.0,
    sleepScore: 100,
    habitScore: 100,
    financeScore: 100,
    focusMinutes: 60
  });
  assert.equal(perfect, 100);

  const half = calculateLifeOSIndex({
    tasksRatio: 0.5,
    waterRatio: 0.5,
    sleepScore: 50,
    habitScore: 50,
    financeScore: 50,
    focusMinutes: 25
  });
  assert.equal(half, 50);
});
