
import { Recipe, User } from "@/types";

// Mock Users
export const users: User[] = [
  {
    id: "1",
    username: "chefjulia",
    name: "Julia Chen",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    bio: "Professional chef with a passion for fusion cuisine"
  },
  {
    id: "2",
    username: "homecook_mike",
    name: "Mike Peterson",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
    bio: "Home cook experimenting with traditional recipes"
  },
  {
    id: "3",
    username: "bakerstreet",
    name: "Sarah Johnson",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    bio: "Pastry chef specializing in gluten-free desserts"
  },
  {
    id: "4",
    username: "spicekings",
    name: "Raj Patel",
    avatarUrl: "https://i.pravatar.cc/150?img=4",
    bio: "Creating spice blends from around the world"
  }
];

// Mock Recipes
export const recipes: Recipe[] = [
  {
    id: "1",
    name: "Classic Sourdough Bread",
    description: "A traditional sourdough recipe with a crispy crust and soft interior. Perfect for beginners!",
    coverImage: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    author: users[0],
    stars: 124,
    forks: 32,
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-04-22T09:15:00Z",
    tags: ["bread", "sourdough", "baking", "starter"],
    ingredients: [
      { id: "i1", name: "Active sourdough starter", quantity: "150", unit: "g" },
      { id: "i2", name: "Bread flour", quantity: "500", unit: "g" },
      { id: "i3", name: "Water", quantity: "350", unit: "ml" },
      { id: "i4", name: "Salt", quantity: "10", unit: "g" }
    ],
    steps: [
      { id: "s1", order: 1, description: "Mix the starter, flour, and water. Let rest for 30 minutes." },
      { id: "s2", order: 2, description: "Add salt and knead until the dough passes the window pane test." },
      { id: "s3", order: 3, description: "Bulk ferment for 4-6 hours with folds every 30 minutes." },
      { id: "s4", order: 4, description: "Shape and place in a floured banneton. Cold proof overnight." },
      { id: "s5", order: 5, description: "Preheat Dutch oven to 500°F. Score and bake covered for 20 minutes." },
      { id: "s6", order: 6, description: "Reduce temperature to 450°F and bake uncovered for another 20-25 minutes." }
    ],
    versions: [
      {
        id: "v1",
        commitMessage: "Initial recipe",
        createdAt: "2023-01-15T12:00:00Z",
        author: users[0]
      },
      {
        id: "v2",
        commitMessage: "Adjusted hydration levels for better crumb",
        createdAt: "2023-02-10T15:30:00Z",
        author: users[0]
      },
      {
        id: "v3",
        commitMessage: "Added step for overnight cold fermentation",
        createdAt: "2023-04-22T09:15:00Z",
        author: users[2]
      }
    ]
  },
  {
    id: "2",
    name: "Thai Red Curry with Vegetables",
    description: "A quick and flavorful Thai curry loaded with vegetables. Customize with your favorite protein!",
    coverImage: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    author: users[1],
    stars: 87,
    forks: 19,
    createdAt: "2023-03-05T18:30:00Z",
    updatedAt: "2023-03-20T14:45:00Z",
    tags: ["thai", "curry", "vegan", "quick", "dinner"],
    ingredients: [
      { id: "i1", name: "Red curry paste", quantity: "3", unit: "tbsp" },
      { id: "i2", name: "Coconut milk", quantity: "400", unit: "ml" },
      { id: "i3", name: "Bell peppers", quantity: "2", unit: "" },
      { id: "i4", name: "Broccoli", quantity: "1", unit: "head" },
      { id: "i5", name: "Carrots", quantity: "2", unit: "" },
      { id: "i6", name: "Tofu (firm)", quantity: "200", unit: "g" },
      { id: "i7", name: "Thai basil leaves", quantity: "1", unit: "handful" },
      { id: "i8", name: "Lime", quantity: "1", unit: "" }
    ],
    steps: [
      { id: "s1", order: 1, description: "Press tofu to remove excess water, then cube." },
      { id: "s2", order: 2, description: "Heat oil in a wok and stir-fry curry paste for 1 minute until fragrant." },
      { id: "s3", order: 3, description: "Add coconut milk and bring to a gentle simmer." },
      { id: "s4", order: 4, description: "Add vegetables and cook for 5-7 minutes until tender-crisp." },
      { id: "s5", order: 5, description: "Add tofu and simmer for another 3 minutes." },
      { id: "s6", order: 6, description: "Season with fish sauce or soy sauce, stir in Thai basil leaves." },
      { id: "s7", order: 7, description: "Serve with fresh lime wedges and steamed jasmine rice." }
    ],
    versions: [
      {
        id: "v1",
        commitMessage: "Initial recipe",
        createdAt: "2023-03-05T18:30:00Z",
        author: users[1]
      },
      {
        id: "v2",
        commitMessage: "Added tofu option",
        createdAt: "2023-03-20T14:45:00Z",
        author: users[1]
      }
    ]
  },
  {
    id: "3",
    name: "No-Bake Chocolate Oatmeal Cookies",
    description: "Quick, easy, and no baking required! These chocolate-peanut butter oatmeal cookies are perfect for a last-minute dessert.",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    author: users[2],
    stars: 156,
    forks: 43,
    createdAt: "2023-02-18T10:15:00Z",
    updatedAt: "2023-05-01T16:20:00Z",
    tags: ["dessert", "no-bake", "chocolate", "quick", "oatmeal"],
    ingredients: [
      { id: "i1", name: "Butter", quantity: "113", unit: "g" },
      { id: "i2", name: "Milk", quantity: "120", unit: "ml" },
      { id: "i3", name: "Sugar", quantity: "200", unit: "g" },
      { id: "i4", name: "Cocoa powder", quantity: "3", unit: "tbsp" },
      { id: "i5", name: "Peanut butter", quantity: "120", unit: "g" },
      { id: "i6", name: "Vanilla extract", quantity: "1", unit: "tsp" },
      { id: "i7", name: "Quick oats", quantity: "270", unit: "g" },
      { id: "i8", name: "Salt", quantity: "1/4", unit: "tsp" }
    ],
    steps: [
      { id: "s1", order: 1, description: "Line two baking sheets with parchment paper." },
      { id: "s2", order: 2, description: "In a saucepan, combine butter, milk, sugar, and cocoa powder. Bring to a rolling boil for 1 minute." },
      { id: "s3", order: 3, description: "Remove from heat and stir in peanut butter and vanilla until smooth." },
      { id: "s4", order: 4, description: "Add oats and salt, mixing until fully incorporated." },
      { id: "s5", order: 5, description: "Drop spoonfuls onto prepared baking sheets and allow to cool until set, about 30 minutes." }
    ],
    versions: [
      {
        id: "v1",
        commitMessage: "Initial recipe",
        createdAt: "2023-02-18T10:15:00Z",
        author: users[2]
      },
      {
        id: "v2",
        commitMessage: "Added salt to enhance chocolate flavor",
        createdAt: "2023-03-10T09:45:00Z",
        author: users[2]
      },
      {
        id: "v3",
        commitMessage: "Adjusted sugar amount",
        createdAt: "2023-04-05T11:30:00Z",
        author: users[0]
      },
      {
        id: "v4",
        commitMessage: "Added almond butter alternative",
        createdAt: "2023-05-01T16:20:00Z",
        author: users[3]
      }
    ]
  },
  {
    id: "4",
    name: "Homemade Pizza Dough",
    description: "The perfect base for any pizza creation. This dough can be made ahead and frozen for future use.",
    coverImage: "https://images.unsplash.com/photo-1621322800607-8c38375eef04",
    author: users[3],
    stars: 210,
    forks: 67,
    createdAt: "2022-12-10T14:00:00Z",
    updatedAt: "2023-04-15T09:30:00Z",
    tags: ["pizza", "dough", "italian", "bread", "basic"],
    ingredients: [
      { id: "i1", name: "All-purpose flour", quantity: "500", unit: "g" },
      { id: "i2", name: "Active dry yeast", quantity: "7", unit: "g" },
      { id: "i3", name: "Warm water", quantity: "325", unit: "ml" },
      { id: "i4", name: "Olive oil", quantity: "2", unit: "tbsp" },
      { id: "i5", name: "Salt", quantity: "10", unit: "g" },
      { id: "i6", name: "Sugar", quantity: "1", unit: "tsp" }
    ],
    steps: [
      { id: "s1", order: 1, description: "Dissolve yeast and sugar in warm water. Let sit for 5-10 minutes until foamy." },
      { id: "s2", order: 2, description: "In a large bowl, combine flour and salt. Make a well in the center." },
      { id: "s3", order: 3, description: "Pour yeast mixture and olive oil into the well. Mix until a shaggy dough forms." },
      { id: "s4", order: 4, description: "Knead on a floured surface for 8-10 minutes until smooth and elastic." },
      { id: "s5", order: 5, description: "Place in an oiled bowl, cover, and let rise until doubled (about 1-2 hours)." },
      { id: "s6", order: 6, description: "Punch down dough and divide into 2-3 portions for individual pizzas." },
      { id: "s7", order: 7, description: "Use immediately or store in the refrigerator for up to 3 days." }
    ],
    versions: [
      {
        id: "v1",
        commitMessage: "Initial recipe",
        createdAt: "2022-12-10T14:00:00Z",
        author: users[3]
      },
      {
        id: "v2",
        commitMessage: "Added overnight refrigeration option",
        createdAt: "2023-01-22T16:45:00Z",
        author: users[3]
      },
      {
        id: "v3",
        commitMessage: "Increased hydration for softer crust",
        createdAt: "2023-04-15T09:30:00Z",
        author: users[1]
      }
    ]
  }
];
