/*
  One-off migration script:
  - Sets ALL existing Product.category values to "Bags"

  Usage (PowerShell):
    node scripts/migrate-categories-to-bags.js

  Notes:
  - Requires DATABASE_URL in your environment.
  - This is intentionally one-way. Take a DB backup if needed.
*/

import prisma from '../lib/prisma.js';

async function main() {
  const result = await prisma.product.updateMany({
    data: { category: 'Bags' },
  });

  console.log(`Updated products: ${result.count}`);
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
