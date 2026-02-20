const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🕯️  Seeding Nivirras Collections database...\n");

  // ─── 1. ADMIN USER ─────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("Admin@123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@nivirras.com" },
    update: { role: "ADMIN" },
    create: {
      name: "Nivirras Admin",
      email: "admin@nivirras.com",
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Admin user: ${admin.email}  (password: Admin@123)`);

  // ─── 2. CATEGORIES ─────────────────────────────────────────────────────────
  const categories = [
    { name: "Soy Candles", slug: "soy-candles", description: "Hand-poured 100% natural soy wax candles" },
    { name: "Scented Candles", slug: "scented-candles", description: "Premium fragrance candles for every mood" },
    { name: "Pillar Candles", slug: "pillar-candles", description: "Classic pillar candles for elegant décor" },
    { name: "Gift Sets", slug: "gift-sets", description: "Curated candle gift sets for every occasion" },
    { name: "Seasonal", slug: "seasonal", description: "Limited edition seasonal and festive candles" },
  ];

  const createdCategories = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = c;
    console.log(`✅ Category: ${c.name}`);
  }

  // ─── 3. PRODUCTS ───────────────────────────────────────────────────────────
  const products = [
    {
      name: "Lavender Dreams",
      slug: "lavender-dreams",
      description: "A soothing blend of French lavender and soft musk. Perfect for unwinding after a long day. Burns cleanly for up to 45 hours.",
      price: 799,
      comparePrice: 999,
      stock: 50,
      featured: true,
      trending: true,
      categorySlug: "soy-candles",
      images: JSON.stringify(["https://images.unsplash.com/photo-1608181831718-c9fef52e8a52?w=600"]),
    },
    {
      name: "Sandalwood & Amber",
      slug: "sandalwood-amber",
      description: "Rich and warm sandalwood layered with sweet amber and a touch of vanilla. A timeless, grounding scent for any space.",
      price: 849,
      comparePrice: 1099,
      stock: 40,
      featured: true,
      trending: false,
      categorySlug: "scented-candles",
      images: JSON.stringify(["https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=600"]),
    },
    {
      name: "Fresh Linen",
      slug: "fresh-linen",
      description: "Crisp, clean and airy. The scent of freshly washed linens drying in a warm breeze. Light and refreshing all day long.",
      price: 699,
      stock: 60,
      featured: false,
      trending: true,
      categorySlug: "soy-candles",
      images: JSON.stringify(["https://images.unsplash.com/photo-1574561840822-430016c90ea6?w=600"]),
    },
    {
      name: "Rose Petal Bliss",
      slug: "rose-petal-bliss",
      description: "An elegant bouquet of fresh roses with a hint of peach blossom. A romantic and feminine fragrance that fills any room.",
      price: 899,
      stock: 35,
      featured: true,
      trending: true,
      categorySlug: "scented-candles",
      images: JSON.stringify(["https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=600"]),
    },
    {
      name: "Eucalyptus Mint",
      slug: "eucalyptus-mint",
      description: "Revitalising eucalyptus with a cool mint finish. Clears the air and energises your senses — ideal for home offices.",
      price: 749,
      stock: 45,
      featured: false,
      trending: true,
      categorySlug: "scented-candles",
      images: JSON.stringify(["https://images.unsplash.com/photo-1599740219989-f2fc84e28d3e?w=600"]),
    },
    {
      name: "Classic Ivory Pillar",
      slug: "classic-ivory-pillar",
      description: "Unscented hand-dipped ivory pillar candle. Pure and elegant — a timeless décor piece for any table or shelf.",
      price: 549,
      stock: 80,
      featured: false,
      trending: false,
      categorySlug: "pillar-candles",
      images: JSON.stringify(["https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600"]),
    },
    {
      name: "Festive Gift Set",
      slug: "festive-gift-set",
      description: "A beautifully boxed set of 3 bestselling candles — Lavender Dreams, Sandalwood Amber & Rose Petal Bliss. Perfect for gifting.",
      price: 1999,
      comparePrice: 2399,
      stock: 25,
      featured: true,
      trending: false,
      categorySlug: "gift-sets",
      images: JSON.stringify(["https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600"]),
    },
    {
      name: "Winter Spice",
      slug: "winter-spice",
      description: "Warm cinnamon, clove and orange peel. This seasonal favourite captures the magic of cosy winter evenings.",
      price: 799,
      stock: 30,
      featured: false,
      trending: true,
      categorySlug: "seasonal",
      images: JSON.stringify(["https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600"]),
    },
  ];

  for (const p of products) {
    const cat = createdCategories[p.categorySlug];
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice ?? null,
        stock: p.stock,
        featured: p.featured,
        trending: p.trending,
        images: p.images,
        sizes: JSON.stringify([]),
        colors: JSON.stringify([]),
        categoryId: cat.id,
      },
    });
    console.log(`✅ Product: ${p.name}`);
  }

  // ─── 4. PROMO CODE ─────────────────────────────────────────────────────────
  await prisma.promoCode.upsert({
    where: { code: "NIVIRRAS10" },
    update: {},
    create: {
      code: "NIVIRRAS10",
      description: "10% off your first order",
      discountType: "PERCENT",
      discountValue: 10,
      minOrderValue: 500,
      firstOrderOnly: true,
      showInBanner: true,
      isActive: true,
    },
  });
  console.log("✅ Promo code: NIVIRRAS10 (10% off)");

  console.log("\n🎉 Seed complete!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Admin login → /admin");
  console.log("  Email   : admin@nivirras.com");
  console.log("  Password: Admin@123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
