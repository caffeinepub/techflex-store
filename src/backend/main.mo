import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  // Product Types
  type Product = {
    id : Text;
    name : Text;
    category : Text;
    price : Nat;
    discountedPrice : Nat;
    imageUrl : Text;
    description : Text;
    inStock : Bool;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.id, product2.id);
    };

    public func compareByPrice(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.price, product2.price);
    };
  };

  // Category Types
  type Category = {
    id : Text;
    name : Text;
    imageUrl : Text;
  };

  module Category {
    public func compare(category1 : Category, category2 : Category) : Order.Order {
      Text.compare(category1.id, category2.id);
    };
  };

  // Shopping Cart Types
  type CartItem = {
    productId : Text;
    quantity : Nat;
  };

  type CartProduct = {
    product : Product;
    quantity : Nat;
  };

  // Persistent Storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let products = Map.empty<Text, Product>();
  let categories = Map.empty<Text, Category>();
  let carts = Map.empty<Principal, [CartItem]>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management
  public shared ({ caller }) func createProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    if (not (products.containsKey(product.id))) {
      Runtime.trap("Product does not exist");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not (products.containsKey(productId))) {
      Runtime.trap("Product does not exist");
    };
    products.remove(productId);
  };

  public query func getProduct(productId : Text) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product };
    };
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(func(p) { p.category == category });
  };

  public query func getProductsByPriceRange(minPrice : Nat, maxPrice : Nat) : async [Product] {
    products.values().toArray().filter(
      func(p) {
        p.price >= minPrice and p.price <= maxPrice
      }
    );
  };

  public query func getProductsSortedByPrice() : async [Product] {
    products.values().toArray().sort(Product.compareByPrice);
  };

  // Category Management
  public shared ({ caller }) func createCategory(category : Category) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create categories");
    };
    categories.add(category.id, category);
  };

  public shared ({ caller }) func updateCategory(category : Category) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update categories");
    };
    if (not (categories.containsKey(category.id))) {
      Runtime.trap("Category does not exist");
    };
    categories.add(category.id, category);
  };

  public shared ({ caller }) func deleteCategory(categoryId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete categories");
    };
    if (not (categories.containsKey(categoryId))) {
      Runtime.trap("Category does not exist");
    };
    categories.remove(categoryId);
  };

  public query func getCategories() : async [Category] {
    categories.values().toArray().sort();
  };

  public query func getCategory(categoryId : Text) : async Category {
    switch (categories.get(categoryId)) {
      case (null) { Runtime.trap("Category does not exist") };
      case (?category) { category };
    };
  };

  // Shopping Cart Management
  public shared ({ caller }) func addToCart(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage shopping carts");
    };
    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };
    if (not (products.containsKey(productId))) {
      Runtime.trap("Product does not exist");
    };
    let currentCart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
    
    // Check if product already exists in cart
    var productFound = false;
    let updatedCart = currentCart.map(
      func(item) {
        if (item.productId == productId) {
          productFound := true;
          {
            productId = item.productId;
            quantity = item.quantity + quantity;
          };
        } else { item };
      }
    );
    
    // If product not found, add it to cart
    let finalCart = if (not productFound) {
      updatedCart.concat([{ productId; quantity }]);
    } else {
      updatedCart;
    };
    
    carts.add(caller, finalCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage shopping carts");
    };
    let currentCart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
    let updatedCart = currentCart.filter(
      func(item) {
        item.productId != productId;
      }
    );
    carts.add(caller, updatedCart);
  };

  public shared ({ caller }) func updateCartQuantity(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage shopping carts");
    };
    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };
    let currentCart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
    let updatedCart = currentCart.map(
      func(item) {
        if (item.productId == productId) {
          {
            productId = item.productId;
            quantity;
          };
        } else { item };
      }
    );
    carts.add(caller, updatedCart);
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage shopping carts");
    };
    carts.add(caller, []);
  };

  public query ({ caller }) func getCart() : async [CartProduct] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access shopping carts");
    };
    let cartItems = switch (carts.get(caller)) {
      case (null) { [] };
      case (?cartItems) { cartItems };
    };
    cartItems.map(
      func(item) {
        let product = switch (products.get(item.productId)) {
          case (null) { Runtime.trap("Product does not exist") };
          case (?product) { product };
        };
        {
          product;
          quantity = item.quantity;
        };
      }
    );
  };

  // Seed Data
  public shared ({ caller }) func seedData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can seed data");
    };
    // Categories
    let categoriesSeed = [
      {
        id = "dc-motors";
        name = "DC Motors";
        imageUrl = "https://www.electronicwings.com/public/images/products/slider/dc-motor.jpg";
      },
      {
        id = "wires";
        name = "Wires";
        imageUrl = "https://aednx.com/wp-content/uploads/2022/02/DSC01158-1-500x500.jpg";
      },
      {
        id = "esp-modules";
        name = "ESP Modules";
        imageUrl = "https://store-cdn.arduino.cc/uni/catalog/product/b/l/black_back_1.jpg";
      },
      {
        id = "arduino";
        name = "Arduino";
        imageUrl = "https://e7.pngegg.com/pngimages/759/334/png-clipart-arduino-electronics-hardware-open-source-hardware-free-diy-blue-cdr.png";
      },
      {
        id = "electronic-components";
        name = "Electronic Components";
        imageUrl = "https://cdn.sparkfun.com//assets/parts/1/3/4/5/1/15592-01.jpg";
      },
      {
        id = "transmitters-receivers";
        name = "Transmitters & Receivers";
        imageUrl = "https://armtronix.net/product-images/3-0-315mhz-handheld-remote-transmitter-3-tx-rx-product-image.png";
      },
    ];

    // Products
    let productSeeds = [
      {
        id = "dc-motor-1";
        name = "12V DC Motor";
        category = "dc-motors";
        price = 60;
        discountedPrice = 50;
        imageUrl = "https://www.electronicwings.com/public/images/products/slider/dc-motor.jpg";
        description = "12V DC motor for electronics projects";
        inStock = true;
      },
      {
        id = "flex-cable-2";
        name = "Flex Cable";
        category = "wires";
        price = 10;
        discountedPrice = 8;
        imageUrl = "https://m.media-amazon.com/images/I/51-uZqQXAIL._AC_UF1000,1000_QL80_.jpg";
        description = "50cm yellow flex cable for connections";
        inStock = true;
      },
      {
        id = "esp8266-3";
        name = "ESP8266 Dev Module";
        category = "esp-modules";
        price = 120;
        discountedPrice = 100;
        imageUrl = "https://cdnshop.adafruit.com/1200x900/2491-03.jpg";
        description = "ESP8266 microcontroller free Dev Module";
        inStock = true;
      },
      {
        id = "arduino-nano-4";
        name = "Arduino Nano";
        category = "arduino";
        price = 160;
        discountedPrice = 140;
        imageUrl = "https://store-cdn.arduino.cc/uni/catalog/product/cache/1/image/552x452/60472f0b2ba2c31d9fc132a70e5c8aac/a/0/a000005_iso_fade_2.jpg";
        description = "Versatile free Arduino Nano microcontroller";
        inStock = true;
      },
      {
        id = "servo-motor-5";
        name = "Servo Motor";
        category = "dc-motors";
        price = 340;
        discountedPrice = 299;
        imageUrl = "https://5.imimg.com/data5/CA/WG/MY-52247060/small-servo-motor-500x500.jpg";
        description = "Small servo motor for robotics";
        inStock = true;
      },
      {
        id = "receiver-board-6";
        name = "Receiver Board";
        category = "transmitters-receivers";
        price = 120;
        discountedPrice = 99;
        imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE9jiB0B8pyo6-rSh47cXNR9vxtnxcIHZ_yA&usqp=CAU";
        description = "Wireless 315 MHz receiver";
        inStock = true;
      },
      {
        id = "leds-7";
        name = "LEDs";
        category = "electronic-components";
        price = 30;
        discountedPrice = 20;
        imageUrl = "https://www.tinkernut.com/wp-content/uploads/2020/04/led-diodes-1030x722.png";
        description = "Mini TX multi-color LED set";
        inStock = true;
      },
      {
        id = "transmitter-module-8";
        name = "Transmitter Module";
        category = "transmitters-receivers";
        price = 77;
        discountedPrice = 60;
        imageUrl = "https://5.imimg.com/data5/SELLER/Default/2021/4/CE/CH/YX/52182176/433-mhz-rf-tx.png";
        description = "315 MHz transmitter trigger module";
        inStock = true;
      },
      {
        id = "wires-9";
        name = "Jump Wires";
        category = "wires";
        price = 30;
        discountedPrice = 25;
        imageUrl = "https://aksharshop.com/cdn/shop/products/jumperwires_20714c3d-4ee2-4a16-b6c3-b7aa0c34ff18.jpg";
        description = "Male-female jump wires";
        inStock = true;
      },
      {
        id = "electronic-kit-10";
        name = "Electronic Kit";
        category = "electronic-components";
        price = 340;
        discountedPrice = 250;
        imageUrl = "https://www.eduvisiononline.com/EduvisionOnline/media/EduvisionOnlineImage/ProductImage/8273.jpg";
        description = "All-in-one DIY electronics kit";
        inStock = true;
      },
    ];

    for (category in categoriesSeed.values()) {
      categories.add(category.id, category);
    };

    for (product in productSeeds.values()) {
      products.add(product.id, product);
    };
  };
};
