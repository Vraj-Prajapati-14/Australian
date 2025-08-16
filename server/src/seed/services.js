const Service = require('../models/Service');
const ServiceCategory = require('../models/ServiceCategory');

async function seedServices() {
  try {
    // Create service categories
    const categories = await ServiceCategory.create([
      {
        name: 'Ute',
        slug: 'ute',
        description: 'Ute service bodies and canopies',
        order: 1
      },
      {
        name: 'Trailer',
        slug: 'trailer',
        description: 'Trailer service bodies',
        order: 2
      },
      {
        name: 'Truck',
        slug: 'truck',
        description: 'Truck service bodies',
        order: 3
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Service body accessories',
        order: 4
      }
    ]);

    // Create main services
    const mainServices = await Service.create([
      {
        title: 'Ute Canopies',
        slug: 'ute-canopies',
        shortDescription: 'Professional ute canopy solutions for all vehicle types',
        summary: 'Lightweight, durable canopies installed in 4 weeks. Maximize payload without compromise. Our co-bonded aluminium canopies are among the lightest on the market, allowing you to carry more gear while staying within GVM limits.',
        isMainService: true,
        category: categories[0]._id,
        isFeatured: true,
        order: 1,
        status: 'active',
        heroImage: {
          url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
          alt: 'Ute Canopy'
        },
        features: ['Lightweight Construction', 'Maximum Payload', 'Quick Installation', 'Customizable'],
        specifications: {
          material: 'Aluminium',
          weight: '45-85kg',
          installation: '2-4 hours',
          warranty: '36 months'
        },
        pricing: {
          base: 2500,
          currency: 'AUD',
          includes: ['Installation', 'Basic Accessories', 'Warranty']
        },
        installationTime: '2-4 hours',
        installationLocations: ['Sydney', 'Melbourne', 'Brisbane', 'Adelaide', 'Perth', 'Goulburn']
      },
      {
        title: 'Trailer Service Bodies',
        slug: 'trailer-service-bodies',
        shortDescription: 'Versatile trailer solutions for mobile operations',
        summary: 'Mobile service solutions on trailers. Versatile trailer solutions with customizable configurations for any industry. Perfect for mobile workshops, emergency services, and field operations.',
        isMainService: true,
        category: categories[1]._id,
        isFeatured: true,
        order: 2,
        status: 'active',
        heroImage: {
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
          alt: 'Trailer Service Body'
        },
        features: ['Mobile Operations', 'Customizable Layout', 'Heavy Duty', 'Weather Resistant'],
        specifications: {
          material: 'Aluminium/Steel',
          weight: '200-500kg',
          installation: '1-2 days',
          warranty: '36 months'
        },
        pricing: {
          base: 8000,
          currency: 'AUD',
          includes: ['Installation', 'Basic Equipment', 'Warranty']
        },
        installationTime: '1-2 days',
        installationLocations: ['Sydney', 'Melbourne', 'Brisbane', 'Adelaide', 'Perth', 'Goulburn']
      },
      {
        title: 'Truck Service Bodies',
        slug: 'truck-service-bodies',
        shortDescription: 'Heavy-duty truck solutions for industrial applications',
        summary: 'Heavy-duty service bodies engineered for maximum durability and functionality. Built for industrial applications, construction, and heavy-duty operations.',
        isMainService: true,
        category: categories[2]._id,
        isFeatured: true,
        order: 3,
        status: 'active',
        heroImage: {
          url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800',
          alt: 'Truck Service Body'
        },
        features: ['Heavy Duty', 'Industrial Grade', 'Maximum Storage', 'Crane Compatible'],
        specifications: {
          material: 'Steel/Aluminium',
          weight: '500-1500kg',
          installation: '2-3 days',
          warranty: '36 months'
        },
        pricing: {
          base: 15000,
          currency: 'AUD',
          includes: ['Installation', 'Basic Equipment', 'Warranty']
        },
        installationTime: '2-3 days',
        installationLocations: ['Sydney', 'Melbourne', 'Brisbane', 'Adelaide', 'Perth', 'Goulburn']
      }
    ]);

    // Create sub-services for Ute Canopies
    const uteSubServices = await Service.create([
      {
        title: 'Aluminium Canopy',
        slug: 'aluminium-canopy',
        shortDescription: 'Lightweight aluminium canopy with integrated storage',
        summary: 'Lightweight aluminium canopy with integrated storage solutions. Perfect for tradespeople who need maximum payload capacity and easy access to tools and equipment.',
        parentService: mainServices[0]._id,
        isMainService: false,
        category: categories[0]._id,
        isFeatured: true,
        order: 1,
        status: 'active',
        heroImage: {
          url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
          alt: 'Aluminium Canopy'
        },
        features: ['Lightweight', 'Strong', 'Customizable', 'Easy Access'],
        specifications: {
          material: 'Aluminium',
          weight: '45kg',
          installation: '2-3 hours',
          warranty: '36 months'
        },
        pricing: {
          base: 2500,
          currency: 'AUD',
          includes: ['Installation', 'Basic Shelving', 'Warranty']
        }
      },
      {
        title: 'Steel Canopy',
        slug: 'steel-canopy',
        shortDescription: 'Heavy-duty steel canopy for maximum security',
        summary: 'Heavy-duty steel canopy for maximum security and durability. Ideal for high-security applications and harsh working environments.',
        parentService: mainServices[0]._id,
        isMainService: false,
        category: categories[0]._id,
        isFeatured: false,
        order: 2,
        status: 'active',
        heroImage: {
          url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
          alt: 'Steel Canopy'
        },
        features: ['Maximum Security', 'Durable', 'Heavy-duty', 'Weather Resistant'],
        specifications: {
          material: 'Steel',
          weight: '85kg',
          installation: '3-4 hours',
          warranty: '36 months'
        },
        pricing: {
          base: 3200,
          currency: 'AUD',
          includes: ['Installation', 'Security Features', 'Warranty']
        }
      },
      {
        title: 'Tool Canopy',
        slug: 'tool-canopy',
        shortDescription: 'Specialized canopy for tool storage and organization',
        summary: 'Specialized canopy designed specifically for tool storage and organization. Features integrated tool holders, drawers, and compartments.',
        parentService: mainServices[0]._id,
        isMainService: false,
        category: categories[0]._id,
        isFeatured: true,
        order: 3,
        status: 'active',
        heroImage: {
          url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
          alt: 'Tool Canopy'
        },
        features: ['Tool Organization', 'Integrated Drawers', 'Easy Access', 'Customizable'],
        specifications: {
          material: 'Aluminium',
          weight: '60kg',
          installation: '3-4 hours',
          warranty: '36 months'
        },
        pricing: {
          base: 3800,
          currency: 'AUD',
          includes: ['Installation', 'Tool Organization System', 'Warranty']
        }
      }
    ]);

    // Create sub-services for Trailer Service Bodies
    const trailerSubServices = await Service.create([
      {
        title: 'Service Body Trailer',
        slug: 'service-body-trailer',
        shortDescription: 'Complete mobile workshop on trailer',
        summary: 'Complete mobile workshop solution built on a trailer platform. Perfect for mobile service operations, emergency response, and field work.',
        parentService: mainServices[1]._id,
        isMainService: false,
        category: categories[1]._id,
        isFeatured: true,
        order: 1,
        status: 'active',
        heroImage: {
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
          alt: 'Service Body Trailer'
        },
        features: ['Mobile Workshop', 'Complete Setup', 'Weather Protected', 'Easy Transport'],
        specifications: {
          material: 'Aluminium/Steel',
          weight: '300kg',
          installation: '1 day',
          warranty: '36 months'
        },
        pricing: {
          base: 12000,
          currency: 'AUD',
          includes: ['Trailer Base', 'Service Body', 'Installation', 'Warranty']
        }
      },
      {
        title: 'Trailer Pack',
        slug: 'trailer-pack',
        shortDescription: 'All-inclusive trailer solution with equipment',
        summary: 'All-inclusive trailer solution that comes with all necessary equipment and accessories. Ready to use immediately after delivery.',
        parentService: mainServices[1]._id,
        isMainService: false,
        category: categories[1]._id,
        isFeatured: false,
        order: 2,
        status: 'active',
        heroImage: {
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
          alt: 'Trailer Pack'
        },
        features: ['All-Inclusive', 'Ready to Use', 'Equipment Included', 'Professional Setup'],
        specifications: {
          material: 'Aluminium/Steel',
          weight: '400kg',
          installation: '1-2 days',
          warranty: '36 months'
        },
        pricing: {
          base: 18000,
          currency: 'AUD',
          includes: ['Trailer', 'Service Body', 'Equipment', 'Installation', 'Warranty']
        }
      }
    ]);

    // Create sub-services for Truck Service Bodies
    const truckSubServices = await Service.create([
      {
        title: 'Service Body Truck',
        slug: 'service-body-truck',
        shortDescription: 'Heavy-duty truck service body for industrial use',
        summary: 'Heavy-duty truck service body designed for industrial applications. Built to withstand the toughest working conditions.',
        parentService: mainServices[2]._id,
        isMainService: false,
        category: categories[2]._id,
        isFeatured: true,
        order: 1,
        status: 'active',
        heroImage: {
          url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800',
          alt: 'Service Body Truck'
        },
        features: ['Heavy Duty', 'Industrial Grade', 'Maximum Storage', 'Durable Construction'],
        specifications: {
          material: 'Steel',
          weight: '800kg',
          installation: '2-3 days',
          warranty: '36 months'
        },
        pricing: {
          base: 20000,
          currency: 'AUD',
          includes: ['Service Body', 'Installation', 'Basic Equipment', 'Warranty']
        }
      },
      {
        title: 'Crane Mounted Truck',
        slug: 'crane-mounted-truck',
        shortDescription: 'Truck service body with integrated crane system',
        summary: 'Truck service body with integrated crane system for heavy lifting operations. Perfect for construction, utilities, and industrial applications.',
        parentService: mainServices[2]._id,
        isMainService: false,
        category: categories[2]._id,
        isFeatured: false,
        order: 2,
        status: 'active',
        heroImage: {
          url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800',
          alt: 'Crane Mounted Truck'
        },
        features: ['Integrated Crane', 'Heavy Lifting', 'Professional Grade', 'Safety Certified'],
        specifications: {
          material: 'Steel',
          weight: '1200kg',
          installation: '3-4 days',
          warranty: '36 months'
        },
        pricing: {
          base: 35000,
          currency: 'AUD',
          includes: ['Service Body', 'Crane System', 'Installation', 'Certification', 'Warranty']
        }
      }
    ]);

    // Update main services with sub-services
    await Service.findByIdAndUpdate(mainServices[0]._id, {
      subServices: uteSubServices.map(s => s._id)
    });

    await Service.findByIdAndUpdate(mainServices[1]._id, {
      subServices: trailerSubServices.map(s => s._id)
    });

    await Service.findByIdAndUpdate(mainServices[2]._id, {
      subServices: truckSubServices.map(s => s._id)
    });

    console.log('✅ Services seeded successfully');
    console.log(`Created ${categories.length} categories`);
    console.log(`Created ${mainServices.length} main services`);
    console.log(`Created ${uteSubServices.length + trailerSubServices.length + truckSubServices.length} sub-services`);

  } catch (error) {
    console.error('❌ Error seeding services:', error);
  }
}

module.exports = seedServices; 