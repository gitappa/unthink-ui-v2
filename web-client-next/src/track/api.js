/*
  Supported user attributes :
    - User name(full_name)
    - User first name(fname)
    - User last name(lname)
    - City of residence(city)
    - Phone number(phone)
    - Age of the user(age)
    - Date of birth of the user(dob)
    - Country of residence(country)
    - Shipping Address(shipping_address)
    - PIN/ZIP code(pin_code)

  Supported product attributes :
    - Product name(title)
    - Product image URL(image)
    - Product link URL(url)
    - Product category(category)
    - Product subcategories(subcategories[])
    - Product price(price)
    - Product SKU(id)
    - Product description(description)

  Supported page identifiers :
    - Home page(home)
    - FAQ page(faq)
    - Profile page(profile)
    - Wishlist page(wishlist)
    - Offers page(offers)
    - About Us page(about_us)
    - Contact page(contact_us)
    - Signup page(signup)
    - Login page(signin)
    - Order tracking page(track_order)
    - Customer care page(contact_us)
    - Blog page(blog)
//*/
/** @namespace intendo */

var intendo = function () {
	this.access_key = "";
	this.utils = new TTUtils(); //Instantiating a utils object for all functions except those publically exposed.

	/**
	 * @function createOrder
	 * @summary Create an order and initiate the life cycle.
	 * @description An order can be seen as a composite event made up of multiple stages. The first stage is to create an order through this API.
	 * Subsequent optional stages can be recorded using <code>{@link setOrderAttribute|setOrderAttribute}</code> API.
	 * An order cannot be without the items being bought. Add items to the order using the <code>{@link addItemsToOrder|addItemsToOrder}</code> API.
	 * Finally, the order lifecycle is concluded by calling the <code>{@link placeOrder|placeOrder}</code> API on the final confirmation page.
	 * @param {object} params - A JSON object containing the order attributes. Following are it's attributes, all of which are mandatory
	 * unless mentioned otherwise.
	 * @param {object} params.user - User object with the properties of the user.
	 * @param {string} params.user.id - User ID of the person. This can be a guest session ID or an email ID(in case of signed in users).
	 * @param {string} params.access_key - Secure access key which is unique to the ecommerce retailer.
	 * @example
	 * cemantika.createOrder({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399"
	 * });
	 */
	this.createOrder = function (user, orders) {
		var order = {
			user_type: "guest",
			object_type: "product",
			action_type: "place_order",
			tt_order_id: this.utils.get_tt_sid(true),
		};

		if (typeof user !== "undefined") {
			if ("user" in user) {
				if ("id" in user["user"] || "email" in user["user"]) {
					if (
						this.utils.validateEmail(user["user"]["id"]) ||
						this.utils.validateEmail(user["user"]["email"])
					) {
						order["user_type"] = "email";
					}
					order["user_id"] = user["user"]["id"];
				}
				order["user"] = user["user"];
			}
		}

		if (typeof orders !== "undefined") {
			for (var keys in orders) {
				order[keys] = orders[keys];
			}
		}

		window.localStorage["order"] = JSON.stringify(order);

		//temp code to check the API

		//this.utils.post(order, true, false);
		window.addEventListener("beforeunload", function () {
			this.utils.post(order, true, false);
			//post(params,async,isIE) - a function which posts 'params' to IN10DO. It's already there in our current SDK.
		});
	};

	/**
	 * @function setOrderAttribute
	 * @summary Identifies the intermediate stages of an order.
	 * @description Any attribute of an order can be passed via this API during an intermediate stage of the order. Let's take an example
	 * of shipping address and payment details to demonstrate this.
	 * @param {object} params - A JSON object containing the order attributes.
	 * @param {object} params.user - User object with the properties of the user.
	 * @param {string} params.user.id - User ID of the person. This can be a guest session ID or an email ID(in case of signed in users).
	 * @param {string} params.access_key - Secure access key which is unique to the ecommerce retailer.
	 * @param {string} [params.shipping_address] - The shipping address of the current order.
	 * @param {string} [params.payment_method] - The payment method of the current order.
	 * @example
	 * //With only shipping_address
	 * cemantika.createOrder({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"shipping_address": "#house no, street name, area, city, state - zip" //sample address
	 * });
	 *
	 *
	 * //With shipping_address and payment_method
	 * cemantika.createOrder({
	 * 	"user": {"id": "john.doe@domain.com"}
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"shipping_address": "#house no, street name, area, city, state - zip" //sample address
	 *	"payment_method": "cod" //Cash on Delivery
	 * });
	 */
	this.setOrderAttribute = function (user, orders) {
		var order = this.utils.getFromLocalStorage("order", {});

		if (typeof user !== "undefined") {
			if ("user" in user) {
				if ("id" in user["user"] || "email" in user["user"]) {
					if (
						this.utils.validateEmail(user["user"]["id"]) ||
						this.utils.validateEmail(user["user"]["email"])
					) {
						order["user_type"] = "email";
					}
					order["user_id"] = user["user"]["id"];
				}
				order["user"] = user["user"];
			}
		}

		for (var key in orders) {
			order[key] = orders[key];
		}
		window.localStorage["order"] = order;
		window.addEventListener("beforeunload", function () {
			this.utils.post(order, true, false);
		});
	};

	/**
	 * @function addItemsToOrder
	 * @summary Adds product(s) to the order.
	 * @description Products being bought can be added to the order through this API before finally placing an order. The attribute product_id
	 * is mandatory, other product attributes like image, title, are optional.
	 * @param {object[]} items - A list of product objects, with a mandatory field <code>product_id</code>, and other optional attributes like
	 * <code>qty</code> and <code>coupon</code>. Each object corresponds to a bought product.
	 * @param {string} items[].product_id - The product SKU ID.
	 * @param {string} [items[].qty] - The quantity in which <code>items[].product_id</code> is bought.
	 * @param {object} [items[].coupon] - The coupon object with attributes such as coupon <i>id</i> and coupon <i>validity</i>.
	 * @example
	 * //Without any optional attributes
	 * cemantika.addItemsToOrder([{ "product_id": "SKU1223" },
	 *                            { "product_id": "SKU1223" }
	 *                           ]);
	 *
	 * //With optional attributes - items[].qty and items[].coupon.
	 * cemantika.addItemsToOrder([{ "product_id": "SKU1223",
	 *                              "qty": "2",
	 *                              "coupon": {"id": "CPN50"}},
	 *                            { "product_id": "SKU1223",
	 *                              "qty": "2",
	 *                              "coupon": {"id": "CPN50"}},
	 *                           ]);
	 */

	this.addItemsToOrder = function (user, orders) {
		var order = this.utils.getFromLocalStorage("order", {});

		if (typeof user !== "undefined") {
			if ("id" in user || "email" in user) {
				if (
					this.utils.validateEmail(user["id"]) ||
					this.utils.validateEmail(user["email"])
				) {
					order["user_type"] = "email";
				}
				order["user_id"] = user["id"];
			}
			order["user"] = user;
		}

		if (!("meta" in order)) order["meta"] = {};

		if (!("orders" in order["meta"])) order["meta"]["orders"] = [];

		if (typeof orders === "object") {
			if (Object.prototype.toString.call(orders) === "[object Array]") {
				for (var idx_prod = 0; idx_prod < orders.length; idx_prod++) {
					order["meta"]["orders"].push(orders[idx_prod]);
				}
			} else {
				order["meta"]["orders"].push(orders);
			}
		}

		window.localStorage["order"] = JSON.stringify(order);
	};

	/**
	 * @function placeOrder
	 * @summary Finalises the order life cycle.
	 * @description The order lifecycle ends with this API. This should be called on the final order confirmation page.
	 * Since the order is deemed complete, the API expects an order ID.
	 * @param {object} params - A JSON object containing the order attributes.
	 * @param {string} params.order_id - The order ID of the current completed order.
	 * @example
	 * cemantika.placeOrder(
	 *                         { "order_id": "ODR2834" },
	 *                     );
	 */
	this.placeOrder = function (user, orders) {
		var order = this.utils.getFromLocalStorage("order", {
			user_type: "guest",
			object_type: "product",
			action_type: "place_order",
		});
		if (this.access_key.length > 0) {
			order["access_key"] = this.access_key;
		}

		if (typeof user !== "undefined") {
			if ("id" in user || "email" in user) {
				if (
					this.utils.validateEmail(user["id"]) ||
					this.utils.validateEmail(user["email"])
				) {
					order["user_type"] = "email";
				}
				order["user_id"] = user["id"];
			}
			order["user"] = user;
		}
		var order_object_ids = [];
		for (var key in orders) {
			if (key === "id") {
				order["object_id"] = orders[key];
				order_object_ids.push(order["object_id"]);
			} else if (key === "products") {
				order["meta"] = {};
				order["meta"]["orders"] = orders[key];
				for (var i = 0; i < orders.length; i++) {
					var o = orders[i];
					if (typeof o === "object" && o["product_id"]) {
						order_object_ids.push(o["product_id"]);
					} else if (typeof o === "string") {
						order_object_ids.push(o);
					}
				}
			} else {
				order[key] = orders[key];
			}
		}

		/*
    	if(typeof(order) === "object")
    	{
    	    if("id" in order)
    	    {
    		order["object_id"] = order["id"];
    		delete order["id"];
    	    }
    	}
    	//*/

		//window.localStorage["order"] = JSON.stringify(order);
		this.utils.post(order, false, false);
		for (var index = 0; index < order_object_ids.length; index++) {
			this.utils.addSessionProduct("negative", order_object_ids[index]);
			this.utils.removeSessionProduct("positive", order_object_ids[index]);
		}
	};

	/**
	 * @function cancelOrder
	 * @summary Cancels an order.
	 * @description Sends a cancel order event, with an order ID, indicating its cancellation.
	 * The API expects an order ID for the unique identification of the order being cancelled.
	 * @param {object} params - A JSON object containing the order attributes.
	 * @param {object} params.user - User object with the properties of the user.
	 * @param {string} params.user.id - User ID of the person. This can be a guest session ID or an email ID(in case of signed in users).
	 * @param {string} params.access_key - Secure access key which is unique to the ecommerce retailer.
	 * @param {string} params.order_id - The order ID of the cancelled order.
	 * @param {boolean} [async=true] - A flag to choose between synchronous and asynchronous API requests.
	 * @example
	 * //Without async(default = true)
	 * cemantika.cancelOrder({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"order_id": "ODR1334"
	 * });
	 *
	 * //With async
	 * cemantika.cancelOrder({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"order_id": "ODR1334"
	 * }, false); //async = false
	 */
	this.cancelOrder = function (user, orders, async) {
		async = this.utils.validateArgument(async, true);
		var order = {
			user_type: "guest",
			object_type: "product",
			action_type: "cancel_order",
		};
		if (this.access_key.length > 0) {
			order["access_key"] = this.access_key;
		}

		if (typeof user !== "undefined") {
			if ("id" in user || "email" in user) {
				if (
					this.utils.validateEmail(user["id"]) ||
					this.utils.validateEmail(user["email"])
				) {
					order["user_type"] = "email";
				}
				order["user_id"] = user["id"];
			}
			order["user"] = user;
		}

		if (typeof orders !== "undefined") {
			for (var key in orders) {
				order[key] = orders[key];
			}
		}

		if ("id" in order) {
			order["object_id"] = order["id"];
			delete order["id"];
		}

		this.utils.post(order, async, false);
	};

	/**
	 * @function addItemToCart
	 * @summary Adds an item to cart
	 * @description This API should be called when an item or product is added to the cart by the user.
	 * @param {object} params - A JSON object containing the user and product attributes.
	 * @param {object} params.user - User object with the properties of the user.
	 * @param {string} params.user.id - User ID of the person. This can be a guest session ID or an email ID(in case of signed in users).
	 * @param {string} params.access_key - Secure access key which is unique to the ecommerce retailer.
	 * @param {string} params.product_id - The SKU ID of the product being added to the cart.
	 * @param {boolean} [async=true] - A flag to choose between synchronous and asynchronous API requests.
	 * @example
	 * //Without async(default = true)
	 * cemantika.addItemToCart({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"product_id": "SKU3749"
	 * });
	 *
	 * //With async
	 * cemantika.addItemToCart({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"product_id": "SKU3749"
	 * }, false); //async = false
	 */
	this.addItemToCart = function (user, products, async) {
		async = this.utils.validateArgument(async, true);
		var event = {
			user_type: "guest",
			object_type: "product",
			action_type: "add_to_cart",
		};
		if (this.access_key.length > 0) {
			event["access_key"] = this.access_key;
		}

		if (typeof user !== "undefined") {
			if ("id" in user || "email" in user) {
				if (
					this.utils.validateEmail(user["id"]) ||
					this.utils.validateEmail(user["email"])
				) {
					event["user_type"] = "email";
				}
				event["user_id"] = user["id"];
			}
			event["user"] = user;
		}

		if (typeof products !== "undefined") {
			for (var key in products) {
				event[key] = products[key];
			}
			if ("id" in event) {
				event["object_id"] = event["id"];
				delete event["id"];
			} else if ("product_id" in event) {
				event["object_id"] = event["product_id"];
				delete event["product_id"];
			}
		}

		// remove carted product from recently viewed
		if (window.localStorage) {
			var vProd = localStorage.getItem("cem.recentlyViewed");
			if ("object_id" in event && vProd) {
				vProd = vProd.split(",");
				var index = vProd.indexOf(event["object_id"]);
				if (index !== -1) {
					vProd.splice(index, 1);
				}
				localStorage.setItem("cem.recentlyViewed", vProd);
				this.utils.setCookie("cem.recentlyViewed", vProd, 100);
			}
		}

		this.utils.post(event, async, false);
		this.utils.removeSessionProduct("positive", event["object_id"]);
		this.utils.addSessionProduct("negative", event["object_id"]);
	};

	/**
	 * @function addItemsToCart
	 * @summary Adds multiple products to the cart at once.
	 * @description This API internally calls <code>{@link addItemToCart|addItemToCart}</code>, and can be used to add multiple products
	 * to the cart in one go.
	 * @param {object} params - A JSON object containing the user and product attributes.
	 * @param {object} params.user - User object with the properties of the user.
	 * @param {string} params.user.id - User ID of the person. This can be a guest session ID or an email ID(in case of signed in users).
	 * @param {string} params.access_key - Secure access key which is unique to the ecommerce retailer.
	 * @param {string[]} params.product_ids - List of SKU IDs of the products being added.
	 * @param {boolean} [async=true] - A flag to choose between synchronous and asynchronous API requests.
	 * @example
	 * //Without async(default = true)
	 * cemantika.addItemsToCart({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"product_ids": ["SKU3749", "SKU7436", "SKU3722"]
	 * });
	 *
	 * //With async
	 * cemantika.addItemsToCart({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"product_ids": ["SKU3749", "SKU7436", "SKU3722"]
	 * }, false);
	 */
	this.addItemsToCart = function (user, products, async) {
		if (
			typeof products === "object" &&
			Object.prototype.toString.call(products) === "[object Array]"
		) {
			for (var idx_prod = 0; idx_prod < products.length; idx_prod++) {
				this.addItemToCart(user, products[idx_prod], async);
			}
		}
	};

	/**
	 * @function setCartItemAttributes
	 * @summary Modifies the product attributes in the cart.
	 * @description This API can be called to set product attributes in the cart. Internally calls
	 * <code>{@link addItemToCart|addItemToCart}</code> to post the product attributes.
	 * @param {object} params - A JSON object containing the user and product attributes.
	 * @param {object} params.user - User object with the properties of the user.
	 * @param {string} params.user.id - User ID of the person. This can be a guest session ID or an email ID(in case of signed in users).
	 * @param {string} params.access_key - Secure access key which is unique to the ecommerce retailer.
	 * @param {string} params.product_id - The SKU ID of the product being added to the cart.
	 * @param {object} params.product - The product object with the product attributes to modify.
	 * @param {boolean} [async=true] - A flag to choose between synchronous and asynchronous API requests.
	 * @example
	 * //Changing the quantity of the product being added in the cart.
	 * //Without async(default = true)
	 * cemantika.setCartItemAttributes({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"product_id": "SKU3749",
	 *	"product": {"qty": "4"}
	 * });
	 *
	 * //Changing the quantity of the product being added in the cart.
	 * //With async
	 * cemantika.setCartItemAttributes({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"product_id": "SKU3749",
	 *	"product": {"qty": "4"}
	 * }, false); //async = false
	 */
	this.setCartItemAttributes = function (user, products, async) {
		this.addItemToCart(user, products, async);
	};

	/**
	 * @function removeItemFromCart
	 * @summary Removes an item from cart
	 * @description This API should be called when an item or product is removed from the cart by the user.
	 * @param {object} params - A JSON object containing the user and product attributes.
	 * @param {object} params.user - User object with the properties of the user.
	 * @param {string} params.user.id - User ID of the person. This can be a guest session ID or an email ID(in case of signed in users).
	 * @param {string} params.access_key - Secure access key which is unique to the ecommerce retailer.
	 * @param {string} params.product_id - The SKU ID of the product being removed from the cart.
	 * @param {boolean} [async=true] - A flag to choose between synchronous and asynchronous API requests.
	 * @example
	 * //Without async(default = true)
	 * cemantika.removeItemFromCart({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"product_id": "SKU3749"
	 * });
	 *
	 * //With async
	 * cemantika.removeItemFromCart({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"product_id": "SKU3749"
	 * }, false); //async = false
	 */
	this.removeItemFromCart = function (user, products, async) {
		async = this.utils.validateArgument(async, true);
		var event = {
			user_type: "guest",
			object_type: "product",
			action_type: "remove_from_cart",
		};
		if (this.access_key.length > 0) {
			event["access_key"] = this.access_key;
		}

		if (typeof user !== "undefined") {
			if ("id" in user || "email" in user) {
				if (
					this.utils.validateEmail(user["id"]) ||
					this.utils.validateEmail(user["email"])
				) {
					event["user_type"] = "email";
				}
				event["user_id"] = user["id"];
			}
			event["user"] = user;
		}

		if (typeof products !== "undefined") {
			for (var key in products) {
				event[key] = products[key];
			}
			if ("id" in event) {
				event["object_id"] = event["id"];
				delete event["id"];
			} else if ("product_id" in event) {
				event["object_id"] = event["product_id"];
				delete event["product_id"];
			}
		}

		// add item removed from cart to recentlyViewed
		if (window.localStorage) {
			var vProd = localStorage.getItem("cem.recentlyViewed");
			if ("object_id" in event) {
				if (vProd) {
					vProd = vProd.split(",");
					var index = vProd.indexOf(event["object_id"]);
					if (index !== -1) {
						vProd.splice(index, 1);
					}
					vProd.splice(0, 0, event["object_id"]);
					vProd.splice(20);
					localStorage.setItem("cem.recentlyViewed", vProd);
					//this.utils.setCookie("cem.recentlyViewed", vProd, 100);
				} else {
					localStorage.setItem("cem.recentlyViewed", event["object_id"]);
					//this.utils.setCookie("cem.recentlyViewed", event["object_id"], 100);
				}
			}
		}
		this.utils.post(event, async, false);
		this.utils.removeSessionProduct("negative", event["object_id"]);
	};

	/**
	 * @function addItemToWishlist
	 * @summary Adds a product to wishlist.
	 * @description This API should be called when an item or product is added to the wishlist by the user.
	 * @param {object} params - A JSON object containing the user and product attributes.
	 * @param {object} params.user - User object with the properties of the user.
	 * @param {string} params.user.id - User ID of the person. This can be a guest session ID or an email ID(in case of signed in users).
	 * @param {string} params.access_key - Secure access key which is unique to the ecommerce retailer.
	 * @param {string} params.product_id - The SKU ID of the product being added to the wishlist.
	 * @param {boolean} [async=true] - A flag to choose between synchronous and asynchronous API requests.
	 * @example
	 * //Without async(default = true)
	 * cemantika.addItemToWishlist({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"product_id": "SKU3749"
	 * });
	 *
	 * //With async
	 * cemantika.addItemToWishlist({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"product_id": "SKU3749"
	 * }, false); //async = false
	 */
	this.addItemToWishlist = function (user, products, async) {
		async = this.utils.validateArgument(async, true);
		var event = {
			user_type: "guest",
			object_type: "product",
			action_type: "add_to_wishlist",
		};
		if (this.access_key.length > 0) {
			event["access_key"] = this.access_key;
		}

		if (typeof user !== "undefined") {
			if ("id" in user || "email" in user) {
				if (
					this.utils.validateEmail(user["id"]) ||
					this.utils.validateEmail(user["email"])
				) {
					event["user_type"] = "email";
				}
				event["user_id"] = user["id"];
			}
			event["user"] = user;
		}

		if (typeof products !== "undefined") {
			for (var key in products) {
				event[key] = products[key];
			}
		}
		if ("id" in event) {
			event["object_id"] = event["id"];
			delete event["id"];
		} else if ("product_id" in event) {
			event["object_id"] = event["product_id"];
			delete event["product_id"];
		}
		this.utils.post(event, async, false);
	};

	/**
	 * @function removeFromWishlist
	 * @summary Removes a product from wishlist.
	 * @description This API should be called when an item or product is removed from the wishlist by the user.
	 * @param {object} params - A JSON object containing the user and product attributes.
	 * @param {object} params.user - User object with the properties of the user.
	 * @param {string} params.user.id - User ID of the person. This can be a guest session ID or an email ID(in case of signed in users).
	 * @param {string} params.access_key - Secure access key which is unique to the ecommerce retailer.
	 * @param {string} params.product_id - The SKU ID of the product being removed from the wishlist.
	 * @param {boolean} [async=true] - A flag to choose between synchronous and asynchronous API requests.
	 * @example
	 * //Without async(default = true)
	 * cemantika.removeFromWishlist({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"product_id": "SKU3749"
	 * });
	 *
	 * //With async
	 * cemantika.removeFromWishlist({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"product_id": "SKU3749"
	 * }, false); //async = false
	 */
	this.removeFromWishlist = function (user, products, async) {
		async = this.utils.validateArgument(async, true);
		var event = {
			user_type: "guest",
			object_type: "product",
			action_type: "remove_from_wishlist",
		};
		if (this.access_key.length > 0) {
			event["access_key"] = this.access_key;
		}

		if (typeof user !== "undefined") {
			if ("id" in user || "email" in user) {
				if (
					this.utils.validateEmail(user["id"]) ||
					this.utils.validateEmail(user["email"])
				) {
					event["user_type"] = "email";
				}
				event["user_id"] = user["id"];
			}
			event["user"] = user;
		}

		for (var key in products) {
			event[key] = products[key];
		}

		if ("id" in event) {
			event["object_id"] = event["id"];
			delete event["id"];
		} else if ("product_id" in event) {
			event["object_id"] = event["product_id"];
			delete event["product_id"];
		}

		this.utils.post(event, async, false);
	};

	/**
	 * @function viewProductPage
	 * @summary Fires a view product event.
	 * @description This API should be called when an item or product is viewed on the website.
	 * @param {object} params - A JSON object containing the user and product attributes.
	 * @param {object} params.user - User object with the properties of the user.
	 * @param {string} params.user.id - User ID of the person. This can be a guest session ID or an email ID(in case of signed in users).
	 * @param {string} params.access_key - Secure access key which is unique to the ecommerce retailer.
	 * @param {string} params.product_id - The SKU ID of the product viewed.
	 * @param {boolean} [async=true] - A flag to choose between synchronous and asynchronous API requests.
	 * @example
	 * //Without async(default = true)
	 * cemantika.viewProductPage({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"product_id": "SKU3749"
	 * });
	 *
	 * //With async
	 * cemantika.viewProductPage({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"product_id": "SKU3749"
	 * }, false); //async = false
	 */
	this.viewProductPage = function (user, products, async) {
		async = this.utils.validateArgument(async, true);
		var event = {
			user_type: "guest",
			object_type: "product",
			action_type: "view",
		};
		if (this.access_key.length > 0) {
			event["access_key"] = this.access_key;
		}

		if (typeof user !== "undefined") {
			if ("id" in user || "email" in user) {
				if (
					this.utils.validateEmail(user["id"]) ||
					this.utils.validateEmail(user["email"])
				) {
					event["user_type"] = "email";
				}
				event["user_id"] = user["id"];
			}
			event["user"] = user;
		}

		for (var key in products) {
			event[key] = products[key];
		}

		if ("id" in event) {
			event["object_id"] = event["id"];
			delete event["id"];
		} else if ("product_id" in event) {
			event["object_id"] = event["product_id"];
			delete event["product_id"];
		}

		// saving the view page details to locals
		if (window.localStorage) {
			var vProd = localStorage.getItem("cem.recentlyViewed");
			if ("object_id" in event) {
				localStorage.setItem("cem.currentlyViewed", event["object_id"]);
				if (vProd) {
					vProd = vProd.split(",");
					var index = vProd.indexOf(event["object_id"]);
					if (index !== -1) {
						vProd.splice(index, 1);
					}
					vProd.splice(0, 0, event["object_id"]);
					vProd.splice(20);
					localStorage.setItem("cem.recentlyViewed", vProd);
					this.utils.setCookie("cem.recentlyViewed", vProd, 100);
				} else {
					localStorage.setItem("cem.recentlyViewed", event["object_id"]);
					this.utils.setCookie("cem.recentlyViewed", event["object_id"], 100);
				}
			}
		}
		this.utils.post(event, async, false);
		this.utils.addSessionProduct("positive", event["object_id"]);
	};

	this.viewProduct = function (user, products, async) {
		this.viewProductPage(user, products, async);
	};

	/**
	 * @function userSignup
	 * @summary Register a new user
	 * @param {object} params - A JSON object containing the user and product attributes.
	 * @param {object} params.user - User object with the properties of the user.
	 * @param {string} params.user.id - User ID of the person. This should be an email ID(in case of signed in users).
	 * @param {boolean} [async=true] - A flag to choose between synchronous and asynchronous API requests.
	 */
	this.userSignup = function (user, async) {
		async = this.utils.validateArgument(async, true);
		var event = {
			user_type: "email",
			action_type: "register",
			object_type: "user",
		};
		if (this.access_key.length > 0) {
			event["access_key"] = this.access_key;
		}

		if (typeof user !== "undefined") {
			if ("id" in user || "email" in user) {
				if (
					this.utils.validateEmail(user["id"]) ||
					this.utils.validateEmail(user["email"])
				) {
					event["user_id"] = user["id"] || user["email"];
					event["object_id"] = user["id"] || user["email"];
					event["user"] = user;

					for (var key in user) {
						event[key] = user[key];
					}
					this.utils.post(event, async, false);
				}
			}
		}
	};

	/**
	 * @function viewCollectionPage
	 * @summary Fires a view collection event.
	 * @description A collection can be any group of products. For example, products under <i>Happy New Year Sale</i> can be a
	 * part of a collection, same as products under a category, say, "Shirts", or, "Electronics".
	 * This API should be called when the user views such a collection page.
	 * @param {object} params - A JSON object containing the user and product attributes.
	 * @param {object} params.user - User object with the properties of the user.
	 * @param {string} params.user.id - User ID of the person. This can be a guest session ID or an email ID(in case of signed in users).
	 * @param {string} params.access_key - Secure access key which is unique to the ecommerce retailer.
	 * @param {string} params.collection_name - The name of the collection, e.g, <b>Diwali Sale, Men Clothing, Laptops & Accessories</b>, etc.
	 * @param {boolean} [async=true] - A flag to choose between synchronous and asynchronous API requests.
	 * @example
	 * //Without async(default = true)
	 * cemantika.viewCollectionPage({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"collection_name": "Diwali Sale"
	 * });
	 *
	 * //With async
	 * cemantika.viewCollectionPage({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"collection_name": "Diwali Sale"
	 * }, false); //async = false
	 */
	this.viewCollectionPage = function (user, products, async) {
		async = this.utils.validateArgument(async, true);
		var event = {
			user_type: "guest",
			object_type: "collection",
			action_type: "view",
		};
		if (this.access_key.length > 0) {
			event["access_key"] = this.access_key;
		}

		if (typeof user !== "undefined") {
			if ("id" in user || "email" in user) {
				if (
					this.utils.validateEmail(user["id"]) ||
					this.utils.validateEmail(user["email"])
				) {
					event["user_type"] = "email";
				}
				event["user_id"] = user["id"];
			}
			event["user"] = user;
		}

		for (var key in products) {
			event[key] = products[key];
		}

		if ("collection_name" in event) {
			event["object_id"] = event["collection_name"];
			delete event["collection_name"];
		}

		this.utils.post(event, async, false);
	};

	/**
	 * @function viewPage
	 * @summary Any page view event can be recorded using this API.
	 * @description Any ecommerce website may have numerous different web pages, apart from a detailed product page and a grouped collection
	 * page. This API can be used to generate an event whenever any such page is visited. See the list of supported page identifiers for
	 * possible page types.
	 * @param {object} params - A JSON object containing the user and product attributes.
	 * @param {object} params.user - User object with the properties of the user.
	 * @param {string} params.user.id - User ID of the person. This can be a guest session ID or an email ID(in case of signed in users).
	 * @param {string} params.access_key - Secure access key which is unique to the ecommerce retailer.
	 * @param {string} params.page_type - The name(identifier) of the page viewed. See the full list of supported page IDs for possible values.
	 * @param {boolean} [async=true] - A flag to choose between synchronous and asynchronous API requests.
	 * @example
	 * //Without async(default = true)
	 * cemantika.viewPage({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"page_type": "faq" //Page identifier for FAQ page
	 * });
	 *
	 * //With async
	 * cemantika.viewPage({
	 * 	"user": {"id": "john.doe@domain.com"},
	 * 	"access_key": "aechf38eundjnvjfv348ru399",
	 *	"page_type": "faq" //Page identifier for FAQ page
	 * }, false); //async = false
	 */
	this.viewPage = function (user, page, async) {
		async = this.utils.validateArgument(async, true);
		var event = { user_type: "guest", action_type: "view" };
		if (this.access_key.length > 0) {
			event["access_key"] = this.access_key;
		}

		if (typeof user !== "undefined") {
			if ("id" in user || "email" in user) {
				if (
					this.utils.validateEmail(user["id"]) ||
					this.utils.validateEmail(user["email"])
				) {
					event["user_type"] = "email";
				}
				event["user_id"] = user["id"];
			}
			event["user"] = user;
		}

		if (typeof page !== "undefined") {
			if (page["pagetype"] !== undefined) {
				page["page_type"] = page["pagetype"];
			}
			if ("page_type" in page && !("object_type" in page)) {
				event["object_type"] = "page";
				event["object_id"] = page["page_type"];
				delete event["page_type"];
			}

			for (var key in page) {
				event[key] = page[key];
			}
		}
		this.utils.post(event, async, false);
	};

	this.userSubscribeToNewsletter = function (user, async) {
		async = this.utils.validateArgument(async, true);
		var event = {
			user_type: "email",
			action_type: "subscribe_to_newsletter",
			object_type: "user",
		};
		if (this.access_key.length > 0) {
			event["access_key"] = this.access_key;
		}

		if (typeof user !== "undefined") {
			if ("id" in user || "email" in user) {
				if (
					this.utils.validateEmail(user["id"]) ||
					this.utils.validateEmail(user["email"])
				) {
					event["user_id"] = user["id"];
					event["object_id"] = user["id"];
					event["user"] = user;

					for (var key in user) {
						event[key] = user[key];
					}
					this.utils.post(event, async, false);
				}
			}
		}
	};

	this.searchProduct = function (user, search, async) {
		async = this.utils.validateArgument(async, true);
		var event = {
			user_type: "guest",
			action_type: "search",
			object_type: "product",
		};
		if (this.access_key.length > 0) {
			event["access_key"] = this.access_key;
		}

		if (typeof user !== "undefined") {
			if ("id" in user || "email" in user) {
				if (
					this.utils.validateEmail(user["id"]) ||
					this.utils.validateEmail(user["email"])
				) {
					event["user_type"] = "email";
				}
				event["user_id"] = user["id"];
			}
			event["user"] = user;
		}

		if (typeof search !== "undefined") {
			if ("query" in search) {
				event["object_id"] = search["query"];
			}

			event["product"] = search;
		}
		this.utils.post(event, async, false);
	};

	// will fire on the first load of api.js in the session.
	// contains info on utm_source, utm_campaign, utm_content
	// and referrer if its present
	this.visitWebsite = function (async) {
		async = this.utils.validateArgument(async, true);
		var action = {
			user_type: "guest",
			object_type: "website",
			action_type: "visit",
			object_id: window.location.hostname,
		};
		if (this.access_key.length > 0) {
			action["access_key"] = this.access_key;
		}
		this.utils.post(action, async, false);
	};

	this.notifyAction = function (action, async) {
		async = this.utils.validateArgument(async, true);
		action["user_type"] = "guest";
		if ("user" in action) {
			if (
				"id" in action["user"] &&
				this.utils.validateEmail(action["user"]["id"])
			) {
				action["user_type"] = "email";
				action["user_id"] = action["user"]["id"];
			} else if (
				"email" in action["user"] &&
				this.utils.validateEmail(action["user"]["email"])
			) {
				action["user_type"] = "email";
				action["user_id"] = action["user"]["email"];
			} else if (
				"user_id" in action &&
				this.utils.validateEmail(action["user_id"])
			) {
				action["user_type"] = "email";
			} else {
				if ("id" in action["user"]) {
					action["user_id"] = action["user"]["id"];
				}
			}
		} else if ("user_id" in action) {
			if (this.utils.validateEmail(action["user_id"])) {
				action["user_type"] = "email";
			}
		}
		this.utils.post(action, async, false);
	};

	/*
    this.submitProductReview = function(user, product, async)
    {
	async = this.utils.validateArgument(async,true);
	var event = {"user_type": "guest", "object_type": "product", "action_type": "review"};

	if(typeof(user) !== "undefined")
	{
	    if("id" in user)
	    {
		if(this.utils.validateEmail(user["id"]))
		{
		    event["user_type"] = "email";
		}
		event["user_id"] = user["id"];
	    }
	    event["user"] = user;
	}

	for(var key in product)
	{
	    event[key] = product[key];
	}

	if("product_id" in event)
	{
	    event["object_id"] = event["product_id"];
	    delete event["product_id"];
	}
	this.utils.post(event, async, false);
    }

    this.submitProductRating = function(user, product, async)
    {
	async = this.utils.validateArgument(async,true);
	var event = {"user_type": "guest", "object_type": "product", "action_type": "rating"};

	if(typeof(user) !== "undefined")
	{
	    if("id" in user)
	    {
		if(this.utils.validateEmail(user["id"]))
		{
		    event["user_type"] = "email";
		}
		event["user_id"] = user["id"];
	    }
	    event["user"] = user;
	}

	for(var key in product)
	{
	    event[key] = product[key];
	}

	if("product_id" in event)
	{
	    event["object_id"] = event["product_id"];
	    delete event["product_id"];
	}
	this.utils.post(event, async, false);
    }
    */
};

var YFretLogger = function () {
	this.log = function (level, header, message) {
		level = level ? level : "info";
		var group = "%cYFret debugger";
		var group_format = "color: blue; font-weight: bold";
		if (header) {
			header = "%c" + header;
			var header_format = "color: black";
			console[level](group + " " + header, group_format, header_format);
		}
		if (message) {
			if (typeof message === "string")
				console[level](group + " %c" + message, group_format, header_format);
			else {
				console[level](
					group + " %cevent parameters",
					group_format,
					header_format
				);
				console[level](message);
			}
		}
	};

	this.ifExists = function (params, key) {
		return (
			key in params &&
			params[key] !== null &&
			params[key] !== undefined &&
			params[key].toString().length > 0
		);
	};

	this.checkEventParams = function (params) {
		var isError = false;
		//action_type missing

		if (!this.ifExists(params, "action_type")) {
			isError = true;
			this.log(
				"error",
				"event_type is missing",
				"make sure the right event API is called"
			);
			this.log("error", null, params);
		} else if (params["action_type"] === "track_session") {
			this.log("info", "track session fired");
			return;
		} else if (params["action_type"] === "visit") {
			this.log("info", "visit event fired");
			return;
		}

		//object_type missing
		else if (
			params["action_type"] !== "track_session" &&
			!this.ifExists(params, "object_type")
		) {
			isError = true;
			this.log(
				"error",
				"object_type is missing",
				"make sure object(product) is passed to the API"
			);
			this.log("error", null, params);
		}

		//user__type missing
		if (!this.ifExists(params, "user_type")) {
			isError = true;
			this.log(
				"error",
				"user_type is missing",
				"pass an empty object - {} for user if the user is not signed in"
			);
			this.log("error", null, params);
		}

		//user_id missing for email users
		else if (params["user_type"] === "email") {
			if (!this.ifExists(params, "user_id")) {
				isError = true;
				this.log("error", "Used id missing for signed in user");
				this.log("error", null, params);
			}
		}

		//object_id missing
		else if (
			["view", "add_to_cart", "remove_from_cart"].indexOf(
				params["action_type"]
			) !== -1
		) {
			if (!this.ifExists(params, "object_id")) {
				isError = true;
				this.log(
					"error",
					params["action_type"] + " event - product ID is missing (object_id)",
					"make sure that the product object has product_id"
				);
				this.log("error", null, params);
			}
		}

		//meta missing in place_order
		else if (params["action_type"] === "place_order") {
			if (!this.ifExists(params, "meta")) {
				isError = true;
				this.log("error", "Place order - products are missing");
				this.log("error", null, params);
			} else {
				var orders = params["meta"]["orders"];

				if (orders === undefined || orders === null || orders.length <= 0) {
					isError = true;
					this.log("error", "Place order - products are missing");
					this.log("error", null, params);
				} else {
					if (typeof orders === "string") {
						orders = JSON.parse(orders);
					}
					// var qtyMissing = false;
					for (var i = 0; i < orders.length; i++) {
						if (!this.ifExists(orders[i], "id")) {
							this.log(
								"error",
								"Place order - product ID is missing in products ordered"
							);
							this.log("error", null, params);
							isError = true;
							break;
						}
						if (!this.ifExists(orders[i], "qty")) {
							this.log(
								"warn",
								"Place order - quantity is missing, will be assumed as 1"
							);
						}
					}
				}
			}
		}

		//no errors
		if (!isError) {
			this.log(
				"info",
				params["object_type"] + " " + params["action_type"] + " event fired"
			);
		}
	};

	this.checkResponse = function (response) {
		this.log("info", "YFret event ID - " + response["id"]);
	};
};

var TTUtils = function () {
	this.prev_tt_sid = null;
	this.addSessionProduct = function (type, object_id) {
		// For session recommendations
		var limit = 7;
		var sessionItem = "yrsn";
		if (type === "positive") {
			sessionItem = "yrsp";
		}
		var pids = window.localStorage.getItem(sessionItem);
		var epochs = window.localStorage.getItem(sessionItem + "e");
		if (pids) {
			pids = JSON.parse(pids);
			epochs = JSON.parse(epochs);
			var remove_pos = pids.indexOf(object_id);
			if (remove_pos !== -1) {
				pids.splice(remove_pos, 1);
				epochs.splice(remove_pos, 1);
			}
			pids.push(object_id);
			epochs.push(new Date().getTime().toString());
			if (limit && pids.length > limit) {
				pids = pids.slice(pids.length - limit);
				epochs = epochs.slice(pids.length - limit);
			}
			pids = JSON.stringify(pids);
			epochs = JSON.stringify(epochs);
		} else {
			pids = JSON.stringify([object_id]);
			epochs = JSON.stringify([new Date().getTime().toString()]);
		}
		window.localStorage.setItem(sessionItem, pids);
		window.localStorage.setItem(sessionItem + "e", epochs);
	};

	this.removeSessionProduct = function (type, object_id) {
		// For session recommendations
		var sessionItem = "yrsn";
		if (type === "positive") {
			sessionItem = "yrsp";
		}
		var pids = window.localStorage.getItem(sessionItem);
		var epochs = window.localStorage.getItem(sessionItem + "e");
		if (pids) {
			pids = JSON.parse(pids);
			epochs = JSON.parse(epochs);
			var remove_pos = pids.indexOf(object_id);
			if (remove_pos !== -1) {
				pids.splice(remove_pos, 1);
				epochs.splice(remove_pos, 1);
				pids = JSON.stringify(pids);
				epochs = JSON.stringify(epochs);
				window.localStorage.setItem(sessionItem, pids);
				window.localStorage.setItem(sessionItem + "e", epochs);
			}
		}
	};

	this.getParameterByName = function (name, url) {
		if (!url) {
			url = window.location.href;
		}
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?#&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return "";
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	};

	this.debug = false;

	if (
		this.getParameterByName("yfret_debug") === 1 ||
		window.sessionStorage.getItem("yfret_debug")
	) {
		this.debug = true;
	}

	this.logger = new YFretLogger();
	this.validateEmail = function (user_id) {
		var re =
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(user_id);
	};

	this.createXMLHTTPObject = function () {
		var XMLHttpFactories = [
			function () {
				return new XMLHttpRequest();
			},
			function () {
				return new window.ActiveXObject("Msxml2.XMLHTTP");
			},
			function () {
				return new window.ActiveXObject("Msxml3.XMLHTTP");
			},
			function () {
				return new window.ActiveXObject("Microsoft.XMLHTTP");
			},
		];

		var xmlhttp = false;
		for (var i = 0; i < XMLHttpFactories.length; i++) {
			try {
				xmlhttp = XMLHttpFactories[i]();
			} catch (e) {
				continue;
			}
			break;
		}
		return xmlhttp;
	};

	this.get_tt_sid = function (recycle) {
		var tt_sid = Math.random().toString();
		var tt_sid_persistant = window.localStorage.getItem("tt_sid");
		var tt_sid_epoch = window.localStorage.getItem("tt_sid_epoch");
		if (tt_sid_epoch) {
			//if new sessions starts within 30 mins pass prev_sid in event
			var tt_sid_expired =
				(new Date() - new Date(parseInt(tt_sid_epoch))) / 60000 > 30;
			if (!tt_sid_expired) {
				this.prev_tt_sid = tt_sid_persistant;
			}

			//handling the 'open in new tab' problem
			if (recycle && tt_sid_persistant) {
				tt_sid = tt_sid_persistant;
			}
		}
		window.localStorage.setItem("prev_tt_sid", tt_sid_persistant);
		window.localStorage.setItem("tt_sid", tt_sid);
		this.setCookie("tt_sid", tt_sid, 365);
		return tt_sid;
	};

	this.getFromLocalStorage = function (object_key, default_value) {
		default_value = this.validateArgument(default_value, null);

		if (object_key in window.localStorage) {
			if (typeof window.localStorage[object_key] !== "undefined") {
				try {
					return JSON.parse(window.localStorage[object_key]);
				} catch (Exception) {
					return window.localStorage[object_key];
				}
			}
		} else {
			return default_value;
		}
	};

	this.validateArgument = function (param, default_value) {
		return typeof param === "undefined" ? default_value : param;
	};

	this.post = function (params, async, isIE) {
		// var url = "http://track.yfret.com/event/";
		var event_id = "";
		var tt_sid = "";

		params["api_version"] = "1.1.0";

		if (Storage) {
			if ("event_id" in window.sessionStorage) {
				event_id = window.sessionStorage["event_id"];
			} else {
				event_id = this.checkCookie("tt_event_id");
				if (event_id === null) {
					event_id = "";
				}
			}

			tt_sid =
				window.sessionStorage.getItem("tt_sid") ||
				this.getParameterByName("yfret_tt_sid");
			var tt_sid_epoch = window.localStorage.getItem("tt_sid_epoch");
			if (tt_sid) {
				if (tt_sid_epoch) {
					//expiry time is 30 minutes
					var tt_sid_expired =
						(new Date() - new Date(parseInt(tt_sid_epoch))) / 60000 > 30;
					if (tt_sid_expired) {
						tt_sid = this.get_tt_sid(false);
						window.sessionStorage.setItem("tt_sid", tt_sid);
					}
				}
			} else {
				tt_sid = this.get_tt_sid(true);
				if (this.prev_tt_sid) {
					params["prev_sid"] = this.prev_tt_sid;
					this.prev_tt_sid = null;
				}
				window.sessionStorage.setItem("tt_sid", tt_sid);
			}
			window.localStorage.setItem("tt_sid_epoch", new Date().getTime());
			//adding account brand to handle multiple websites in same account - yfret_subaccount
			if ("ysa" in window.sessionStorage) {
				params["sub_account"] = window.sessionStorage.getItem("ysa");
			}

			//adding access_key from session storage
			if ("yk" in window.sessionStorage) {
				params["access_key"] = window.sessionStorage.getItem("yk");
			}
			if (
				document.referrer &&
				document.referrer.indexOf(window.location.hostname) === -1
			) {
				try {
					params["referrer"] = new URL(document.referrer).hostname;
				} catch (err) {
					params["referrer"] = document.referrer;
				}
			}

			if (this.getFromClientStorage("cem.subscriptionId")) {
				params["browser_endpoint"] =
					this.getFromClientStorage("cem.subscriptionId");
			}
		}

		if (event_id !== null) {
			params["event_id"] = event_id;
		}
		if (tt_sid !== null) {
			params["sid"] = tt_sid;
		}

		var now = new Date();
		var when = now.getTime();
		var tz = now.getTimezoneOffset();
		tz = tz.toString();
		params["tz"] = tz;

		var url_tt_id = this.getParameterByName("yfret_tt_id");
		var tt_id = window.localStorage.getItem("tt_id") || this.checkCookie("tid");
		if (!tt_id && !url_tt_id) {
			params["new_user"] = 1;
		}
		if (tt_id === null) {
			tt_id = url_tt_id || when.toString();
			this.setCookie("tid", tt_id, 365);
			window.localStorage.setItem("tt_id", tt_id);
		} else if (tt_id && url_tt_id && tt_id !== url_tt_id) {
			tt_id = url_tt_id;
			this.setCookie("tid", tt_id, 365);
			window.localStorage.setItem("tt_id", tt_id);
		}
		params["tt_id"] = tt_id;
		if (window.localStorage.getItem("yfret_ai_demo")) {
			params["yfret_ai_demo"] = 1;
		}

		var protocol = window.location.protocol;
		for (var key in params) {
			if (typeof params[key] === "object") {
				try {
					params[key] = encodeURIComponent(JSON.stringify(params[key]));
				} catch (error) {
					console.warn("[CEM ERROR] " + error.message);
					continue;
				}
			}
		}
		var req = null;
		if (isIE) {
			if (window.XDomainRequest) {
				req = new window.XDomainRequest();
			}
		} else {
			req = this.createXMLHTTPObject();
		}

		var meta_tags = this.pickUpOGTags(params);
		for (var attr in meta_tags) {
			params[attr] = meta_tags[attr];
		}

		var url_get = protocol + "//track.yfret.com/event/?when=" + when;
		for (var param in params) {
			url_get += "&" + param + "=" + params[param];
		}
		var self = this;
		if (req !== null || req !== "undefined") {
			if (this.debug) {
				this.logger.checkEventParams(params);
				params["performEventChecks"] = 1;
			}
			req.open("GET", url_get, async);
			req.onload = function (e) {
				var arraybuffer = req.response;
				var response = JSON.parse(arraybuffer);
				if (self.debug) {
					self.logger.checkResponse(response);
				}
				if ("id" in response) {
					if (Storage) {
						window.sessionStorage["event_id"] = response["id"];
						self.setCookie("tt_event_id", response["id"]);
					}
				}
			};

			req.send();
		}
		if (window.cemComponent && window.cemComponent.webPush) {
			var webPush = new window.cemComponent.webPush();
			webPush.checkEligibiltyForPush(params);
		}
	};

	this.getCookie = function (name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(";");

		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === " ") {
				c = c.substring(1, c.length);
			}
			if (c.indexOf(nameEQ) === 0) {
				return c.substring(nameEQ.length, c.length);
			}
		}
		return null;
	};

	this.pickUpOGTags = function (param) {
		var array_meta_tags = document.getElementsByTagName("meta");
		var og_data = {};
		for (var idx_meta = 0; idx_meta < array_meta_tags.length; idx_meta++) {
			var property = array_meta_tags[idx_meta].getAttribute("property");
			var content = array_meta_tags[idx_meta].getAttribute("content");
			if (
				(property === "og:title" || property === "og:image") &&
				content !== null
			) {
				og_data[property] = content;
			}
		}
		og_data["og:url"] = param.url || encodeURIComponent(window.location.href);
		return og_data;
	};

	this.setCookie = function (c_name, value, exdays) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value =
			escape(value) +
			(exdays === null ? "" : "; expires=" + exdate.toUTCString());
		c_value += ";SameSite=Strict; path=/";
		document.cookie = c_name + "=" + c_value;
	};

	this.getFromClientStorage = function (storage_name, cookie_name) {
		cookie_name = this.validateArgument(cookie_name, storage_name);
		if (window.localStorage.getItem(storage_name)) {
			return window.localStorage.getItem(storage_name);
		} else if (this.checkCookie(cookie_name)) {
			return this.checkCookie(cookie_name);
		} else {
			return null;
		}
	};

	this.checkCookie = function (c_name) {
		var c_value = this.getCookie(c_name);
		if (c_value !== null && c_value !== "") {
			return c_value;
		} else {
			return null;
		}
	};
};

const CemantikaExport = () => {
	var cemantika = { ecommerce: new intendo(), api: new intendo() };
	if (window.cemantika) {
		window.cemantika = {
			...window.cemantika,
			cemantika,
		};
	} else {
		window.cemantika = cemantika;
	}
	var utils = new TTUtils();

	if (
		utils.getParameterByName("yfret_debug") === 1 ||
		window.sessionStorage.getItem("yfret_debug")
	) {
		utils.debug = true;
		window.sessionStorage.setItem("yfret_debug", 1);
	}

	// making sure we get all the campaingn events
	if (
		utils.getParameterByName("yfret_source") ||
		utils.getParameterByName("yfret_campaign") ||
		utils.getParameterByName("yfret_medium") ||
		utils.getParameterByName("utm_source") ||
		utils.getParameterByName("utm_campaign") ||
		utils.getParameterByName("utm_medium") ||
		utils.getParameterByName("utm_content") ||
		utils.getParameterByName("yfret_utm_source") ||
		utils.getParameterByName("yfret_utm_campaign") ||
		utils.getParameterByName("yfret_utm_medium") ||
		utils.getParameterByName("yfret_utm_content")
	) {
		cemantika.ecommerce.visitWebsite();
	}

	//making sure we get sid from all pages
	else if (!window.sessionStorage.getItem("tt_sid")) {
		cemantika.ecommerce.visitWebsite();
	} else if (window.localStorage.getItem("tt_sid_epoch")) {
		var tt_sid_epoch = window.localStorage.getItem("tt_sid_epoch");
		var tt_sid_invalid =
			(new Date() - new Date(parseInt(tt_sid_epoch))) / 60000 > 30;
		if (tt_sid_invalid) {
			cemantika.ecommerce.visitWebsite();
		}
	} else if (
		document.referrer &&
		document.referrer.indexOf(window.location.hostname) === -1
	) {
		cemantika.ecommerce.visitWebsite();
	}
};
export default CemantikaExport;
