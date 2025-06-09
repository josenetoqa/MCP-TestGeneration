import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('Test Case 01: Register, verify, and delete user', async ({ page }) => {
  // Generate dynamic user data
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName, provider: 'example.com' });
  const password = faker.internet.password({ length: 12 });
  const company = faker.company.name();
  const address1 = faker.location.streetAddress();
  const address2 = faker.location.secondaryAddress();
  const state = faker.location.state();
  const city = faker.location.city();
  const zipcode = faker.location.zipCode();
  const mobile = faker.string.numeric(10);

  // 1. Launch browser and navigate to url
  await page.goto('http://automationexercise.com');

  // 2. Verify that home page is visible successfully
  await expect(page).toHaveURL(/automationexercise/);
  await expect(page.getByRole('link', { name: 'Signup / Login' })).toBeVisible();

  // 3. Click on 'Signup / Login' button
  await page.getByRole('link', { name: 'Signup / Login' }).click();
  // Wait for the signup form to be visible
  await expect(page.getByText('New User Signup!')).toBeVisible();

  // 4. Enter name and email address (use data-qa selectors to avoid strict mode violation)
  await page.locator('[data-qa="signup-name"]').fill(firstName);
  await page.locator('[data-qa="signup-email"]').fill(email);

  // 5. Click 'Signup' button
  await page.getByRole('button', { name: 'Signup' }).click();
  // Wait for account info form
  await expect(page.getByText('Enter Account Information')).toBeVisible();

  // 6. Fill details: Title, Name, Email, Password, Date of birth
  await page.getByLabel('Mr.').check();
  await page.locator('[data-qa="password"]').fill(password);
  await page.locator('select#days').selectOption('10');
  await page.locator('select#months').selectOption({ label: 'May' });
  await page.locator('select#years').selectOption('1990');

  // 7. Select checkboxes
  await page.getByLabel('Sign up for our newsletter!').check();
  await page.getByLabel('Receive special offers from our partners!').check();

  // 8. Fill address details
  await page.locator('[data-qa="first_name"]').fill(firstName);
  await page.locator('[data-qa="last_name"]').fill(lastName);
  await page.locator('[data-qa="company"]').fill(company);
  await page.locator('[data-qa="address"]').fill(address1);
  await page.locator('[data-qa="address2"]').fill(address2);
  await page.locator('select#country').selectOption({ label: 'United States' });
  await page.locator('[data-qa="state"]').fill(state);
  await page.locator('[data-qa="city"]').fill(city);
  await page.locator('[data-qa="zipcode"]').fill(zipcode);
  await page.locator('[data-qa="mobile_number"]').fill(mobile);

  // 9. Click 'Create Account' button
  await page.getByRole('button', { name: 'Create Account' }).click();
  // Wait for account created confirmation
  await expect(page.getByText('Account Created!')).toBeVisible();

  // 10. Click 'Continue' button
  await page.getByRole('link', { name: 'Continue' }).click();
  // Wait for home page and 'Logged in as' to be visible
  await expect(page.getByText(`Logged in as ${firstName}`)).toBeVisible();
  // Assert that the 'Logout' button is visible after login
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();

  // 11. Click 'Delete Account' button
  await page.getByRole('link', { name: /Delete Account/ }).click();
  // Wait for account deleted confirmation
  await expect(page.getByText('Account Deleted!')).toBeVisible();

  // 12. Click 'Continue' button
  await page.getByRole('link', { name: 'Continue' }).click();
  // Assert that 'Logged in as' is NOT visible after account deletion
  await expect(page.getByText(`Logged in as ${firstName}`)).not.toBeVisible();

});

test('Test Case 02: Login User with correct email and password', async ({ page }) => {
  // Generate dynamic user data
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName, provider: 'example.com' });
  const password = faker.internet.password({ length: 12 });

  // --- Register user first ---
  await page.goto('http://automationexercise.com');
  await page.getByRole('link', { name: 'Signup / Login' }).click();
  await expect(page.getByText('New User Signup!')).toBeVisible();
  await page.locator('[data-qa="signup-name"]').fill(firstName);
  await page.locator('[data-qa="signup-email"]').fill(email);
  await page.getByRole('button', { name: 'Signup' }).click();
  await expect(page.getByText('Enter Account Information')).toBeVisible();
  await page.getByLabel('Mr.').check();
  await page.locator('[data-qa="password"]').fill(password);
  await page.locator('select#days').selectOption('10');
  await page.locator('select#months').selectOption({ label: 'May' });
  await page.locator('select#years').selectOption('1990');
  await page.getByLabel('Sign up for our newsletter!').check();
  await page.getByLabel('Receive special offers from our partners!').check();
  await page.locator('[data-qa="first_name"]').fill(firstName);
  await page.locator('[data-qa="last_name"]').fill(lastName);
  await page.locator('[data-qa="company"]').fill(faker.company.name());
  await page.locator('[data-qa="address"]').fill(faker.location.streetAddress());
  await page.locator('[data-qa="address2"]').fill(faker.location.secondaryAddress());
  await page.locator('select#country').selectOption({ label: 'United States' });
  await page.locator('[data-qa="state"]').fill(faker.location.state());
  await page.locator('[data-qa="city"]').fill(faker.location.city());
  await page.locator('[data-qa="zipcode"]').fill(faker.location.zipCode());
  await page.locator('[data-qa="mobile_number"]').fill(faker.string.numeric(10));
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByText('Account Created!')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(page.getByText(`Logged in as ${firstName}`)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByText('Login to your account')).toBeVisible();

  // --- Now login with correct credentials ---
  await page.locator('[data-qa="login-email"]').fill(email);
  await page.locator('[data-qa="login-password"]').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText(`Logged in as ${firstName}`)).toBeVisible();
  // Delete account
  await page.getByRole('link', { name: /Delete Account/ }).click();
  await expect(page.getByText('Account Deleted!')).toBeVisible();
});

test('Test Case 03: Login User with incorrect email and password', async ({ page }) => {
  // Generate random credentials
  const email = faker.internet.email();
  const password = faker.internet.password({ length: 12 });

  await page.goto('http://automationexercise.com');
  await page.getByRole('link', { name: 'Signup / Login' }).click();
  await expect(page.getByText('Login to your account')).toBeVisible();
  await page.locator('[data-qa="login-email"]').fill(email);
  await page.locator('[data-qa="login-password"]').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
});

test('Test Case 4: Logout User', async ({ page }) => {
  // Generate dynamic user data
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName, provider: 'example.com' });
  const password = faker.internet.password({ length: 12 });

  // Register user
  await page.goto('http://automationexercise.com');
  await page.getByRole('link', { name: 'Signup / Login' }).click();
  await expect(page.getByText('New User Signup!')).toBeVisible();
  await page.locator('[data-qa="signup-name"]').fill(firstName);
  await page.locator('[data-qa="signup-email"]').fill(email);
  await page.getByRole('button', { name: 'Signup' }).click();
  await expect(page.getByText('Enter Account Information')).toBeVisible();
  await page.getByLabel('Mr.').check();
  await page.locator('[data-qa="password"]').fill(password);
  await page.locator('select#days').selectOption('10');
  await page.locator('select#months').selectOption({ label: 'May' });
  await page.locator('select#years').selectOption('1990');
  await page.getByLabel('Sign up for our newsletter!').check();
  await page.getByLabel('Receive special offers from our partners!').check();
  await page.locator('[data-qa="first_name"]').fill(firstName);
  await page.locator('[data-qa="last_name"]').fill(lastName);
  await page.locator('[data-qa="company"]').fill(faker.company.name());
  await page.locator('[data-qa="address"]').fill(faker.location.streetAddress());
  await page.locator('[data-qa="address2"]').fill(faker.location.secondaryAddress());
  await page.locator('select#country').selectOption({ label: 'United States' });
  await page.locator('[data-qa="state"]').fill(faker.location.state());
  await page.locator('[data-qa="city"]').fill(faker.location.city());
  await page.locator('[data-qa="zipcode"]').fill(faker.location.zipCode());
  await page.locator('[data-qa="mobile_number"]').fill(faker.string.numeric(10));
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByText('Account Created!')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(page.getByText(`Logged in as ${firstName}`)).toBeVisible();

  // Logout flow
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByText('Login to your account')).toBeVisible();
});

test('Test Case 5: Register User with existing email', async ({ page }) => {
  // Generate dynamic user data
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName, provider: 'example.com' });
  const password = faker.internet.password({ length: 12 });

  // Register user
  await page.goto('http://automationexercise.com');
  await page.getByRole('link', { name: 'Signup / Login' }).click();
  await expect(page.getByText('New User Signup!')).toBeVisible();
  await page.locator('[data-qa="signup-name"]').fill(firstName);
  await page.locator('[data-qa="signup-email"]').fill(email);
  await page.getByRole('button', { name: 'Signup' }).click();
  await expect(page.getByText('Enter Account Information')).toBeVisible();
  await page.getByLabel('Mr.').check();
  await page.locator('[data-qa="password"]').fill(password);
  await page.locator('select#days').selectOption('10');
  await page.locator('select#months').selectOption({ label: 'May' });
  await page.locator('select#years').selectOption('1990');
  await page.getByLabel('Sign up for our newsletter!').check();
  await page.getByLabel('Receive special offers from our partners!').check();
  await page.locator('[data-qa="first_name"]').fill(firstName);
  await page.locator('[data-qa="last_name"]').fill(lastName);
  await page.locator('[data-qa="company"]').fill(faker.company.name());
  await page.locator('[data-qa="address"]').fill(faker.location.streetAddress());
  await page.locator('[data-qa="address2"]').fill(faker.location.secondaryAddress());
  await page.locator('select#country').selectOption({ label: 'United States' });
  await page.locator('[data-qa="state"]').fill(faker.location.state());
  await page.locator('[data-qa="city"]').fill(faker.location.city());
  await page.locator('[data-qa="zipcode"]').fill(faker.location.zipCode());
  await page.locator('[data-qa="mobile_number"]').fill(faker.string.numeric(10));
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByText('Account Created!')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(page.getByText(`Logged in as ${firstName}`)).toBeVisible();
  // Logout to return to signup page
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByText('Login to your account')).toBeVisible();

  // Attempt to register again with the same email
  await page.locator('[data-qa="signup-name"]').fill(firstName);
  await page.locator('[data-qa="signup-email"]').fill(email);
  await page.getByRole('button', { name: 'Signup' }).click();
  await expect(page.getByText('Email Address already exist!')).toBeVisible();
});

test('Test Case 6: Contact Us Form', async ({ page }) => {
  // Generate dynamic user data
  const name = faker.person.fullName();
  const email = faker.internet.email();
  const subject = faker.lorem.words(3);
  const message = faker.lorem.sentences(2);
  const filePath = 'tests/fixtures/sample.txt'; // <-- Certifique-se de que este arquivo existe

  await page.goto('http://automationexercise.com');
  await expect(page).toHaveURL(/automationexercise/);
  await page.getByRole('link', { name: /Contact Us/i }).click();
  await expect(page.getByText('Get In Touch')).toBeVisible();
  await page.locator('[data-qa="name"]').fill(name);
  await page.locator('[data-qa="email"]').fill(email);
  await page.locator('[data-qa="subject"]').fill(subject);
  await page.locator('[data-qa="message"]').fill(message);
  // File upload
  await page.setInputFiles('input[type="file"]', filePath);
  await page.getByRole('button', { name: /Submit/i }).click();
  // Handle alert/OK dialog
  await page.once('dialog', dialog => dialog.accept());
  await expect(page.getByText('Success! Your details have been submitted successfully.')).toBeVisible();
  await page.getByRole('link', { name: /Home/i }).click();
  await expect(page.getByRole('link', { name: 'Signup / Login' })).toBeVisible();
});

test('Test Case 7: Verify Test Cases Page', async ({ page }) => {
  await page.goto('http://automationexercise.com');
  await expect(page).toHaveURL(/automationexercise/);
  await page.getByRole('link', { name: /Test Cases/i }).nth(1).click();
  await expect(page).toHaveURL(/test_cases/);
  await expect(page.locator('.title', { hasText: 'Test Cases' })).toBeVisible();
});

test('Test Case 8: Verify All Products and product detail page', async ({ page }) => {
  await page.goto('http://automationexercise.com');
  await expect(page).toHaveURL(/automationexercise/);
  await page.getByRole('link', { name: /Products/i }).click();
  await expect(page).toHaveURL(/products/);
  await expect(page.getByText('All Products')).toBeVisible();
  // The products list is visible
  await expect(page.locator('.features_items')).toBeVisible();
  // Click on 'View Product' of first product
  await page.locator('a[href^="/product_details/"]').first().click();
  // User is landed to product detail page
  await expect(page).toHaveURL(/product_details/);
  // Verify product details are visible
  await expect(page.locator('.product-information')).toBeVisible();
  await expect(page.locator('.product-information h2')).toBeVisible(); // product name
  await expect(page.locator('.product-information p:has-text("Category")')).toBeVisible();
  await expect(page.locator('.product-information span:has-text("Rs.")').first()).toBeVisible(); // price
  await expect(page.locator('.product-information b:has-text("Availability:")')).toBeVisible();
  await expect(page.locator('.product-information b:has-text("Condition:")')).toBeVisible();
  await expect(page.locator('.product-information b:has-text("Brand:")')).toBeVisible();
});

test('Test Case 9: Search Product', async ({ page }) => {
  const searchTerm = 'dress'; // You can use faker.commerce.product() for more variety
  await page.goto('http://automationexercise.com');
  await expect(page).toHaveURL(/automationexercise/);
  await page.getByRole('link', { name: /Products/i }).click();
  await expect(page).toHaveURL(/products/);
  await expect(page.getByText('All Products')).toBeVisible();
  // Enter product name in search input and click search button
  await page.locator('[data-qa="search-product"]').fill(searchTerm);
  await page.locator('[data-qa="search-button"]').click();
  // Verify 'SEARCHED PRODUCTS' is visible
  await expect(page.getByText('Searched Products')).toBeVisible();
  // Verify all the products related to search are visible
  await expect(page.locator('.features_items .product-image-wrapper')).toBeVisible();
});

test('Test Case 10: Verify Subscription in home page', async ({ page }) => {
  const email = faker.internet.email();
  await page.goto('http://automationexercise.com');
  await expect(page).toHaveURL(/automationexercise/);
  // Scroll down to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  // Verify text 'SUBSCRIPTION'
  await expect(page.getByText('Subscription', { exact: false })).toBeVisible();
  // Enter email address in input and click arrow button
  await page.locator('[data-qa="subscribe-email"]').fill(email);
  await page.locator('[data-qa="subscribe-button"]').click();
  // Verify success message
  await expect(page.getByText('You have been successfully subscribed!')).toBeVisible();
});

test('Test Case 11: Verify Subscription in Cart page', async ({ page }) => {
  const email = faker.internet.email();
  await page.goto('http://automationexercise.com');
  await expect(page).toHaveURL(/automationexercise/);
  // Click 'Cart' button
  await page.getByRole('link', { name: /Cart/i }).click();
  await expect(page).toHaveURL(/view_cart/);
  // Scroll down to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  // Verify text 'SUBSCRIPTION'
  await expect(page.getByText('Subscription', { exact: false })).toBeVisible();
  // Enter email address in input and click arrow button
  await page.locator('[data-qa="subscribe-email"]').fill(email);
  await page.locator('[data-qa="subscribe-button"]').click();
  // Verify success message
  await expect(page.getByText('You have been successfully subscribed!')).toBeVisible();
});

test('Test Case 12: Add Products in Cart', async ({ page }) => {
  await page.goto('http://automationexercise.com');
  await expect(page).toHaveURL(/automationexercise/);
  await page.getByRole('link', { name: /Products/i }).click();
  await expect(page).toHaveURL(/products/);
  // Hover over first product and click 'Add to cart'
  await page.locator('.features_items .product-image-wrapper').first().hover();
  await page.locator('.features_items .product-image-wrapper').first().locator('.productinfo .btn.add-to-cart').click();
  // Click 'Continue Shopping' button
  await page.getByRole('button', { name: /Continue Shopping/i }).click();
  // Hover over second product and click 'Add to cart'
  await page.locator('.features_items .product-image-wrapper').nth(1).hover();
  await page.locator('.features_items .product-image-wrapper').nth(1).locator('.productinfo .btn.add-to-cart').click();
  // Click 'View Cart' button
  await page.locator('a', { hasText: 'View Cart' }).click();
  await expect(page).toHaveURL(/view_cart/);
  // Verify both products are added to Cart
  await expect(page.locator('tr.cart_product')).toHaveCount(2);
  // Verify their prices, quantity and total price
  await expect(page.locator('tr.cart_product .cart_price')).toHaveCount(2);
  await expect(page.locator('tr.cart_product .cart_quantity')).toHaveCount(2);
  await expect(page.locator('tr.cart_product .cart_total')).toHaveCount(2);
});

test('Test Case 13: Verify Product quantity in Cart', async ({ page }) => {
  await page.goto('http://automationexercise.com');
  await expect(page).toHaveURL(/automationexercise/);
  // Click 'View Product' for any product on home page
  await page.locator('a[href^="/product_details/"]').first().click();
  await expect(page).toHaveURL(/product_details/);
  // Increase quantity to 4
  await page.locator('input[name="quantity"]').fill('4');
  // Click 'Add to cart' button
  await page.getByRole('button', { name: /Add to cart/i }).click();
  // Click 'View Cart' button
  await page.locator('a', { hasText: 'View Cart' }).click();
  await expect(page).toHaveURL(/view_cart/);
  // Verify that product is displayed in cart page with exact quantity
  await expect(page.locator('tr.cart_product .cart_quantity input')).toHaveValue('4');
});

test('Test Case 14: Place Order: Register while Checkout', async ({ page }) => {
  // Generate dynamic user data
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName, provider: 'example.com' });
  const password = faker.internet.password({ length: 12 });
  const company = faker.company.name();
  const address1 = faker.location.streetAddress();
  const address2 = faker.location.secondaryAddress();
  const state = faker.location.state();
  const city = faker.location.city();
  const zipcode = faker.location.zipCode();
  const mobile = faker.string.numeric(10);

  await page.goto('http://automationexercise.com');
  await expect(page).toHaveURL(/automationexercise/);
  // Add products to cart
  await page.getByRole('link', { name: /Products/i }).click();
  await expect(page).toHaveURL(/products/);
  await page.locator('.features_items .product-image-wrapper').first().hover();
  await page.locator('.features_items .product-image-wrapper').first().locator('.productinfo .btn.add-to-cart').click();
  await page.getByRole('button', { name: /Continue Shopping/i }).click();
  // Click 'Cart' button
  await page.getByRole('link', { name: /Cart/i }).click();
  await expect(page).toHaveURL(/view_cart/);
  // Click Proceed To Checkout
  await page.locator('a', { hasText: 'Proceed To Checkout' }).click();
  // Click 'Register / Login' button
  await page.locator('a', { hasText: /Register|Signup|Login/ }).click();
  // Fill all details in Signup and create account
  await page.locator('[data-qa="signup-name"]').fill(firstName);
  await page.locator('[data-qa="signup-email"]').fill(email);
  await page.getByRole('button', { name: 'Signup' }).click();
  await expect(page.getByText('Enter Account Information')).toBeVisible();
  await page.getByLabel('Mr.').check();
  await page.locator('[data-qa="password"]').fill(password);
  await page.locator('select#days').selectOption('10');
  await page.locator('select#months').selectOption({ label: 'May' });
  await page.locator('select#years').selectOption('1990');
  await page.getByLabel('Sign up for our newsletter!').check();
  await page.getByLabel('Receive special offers from our partners!').check();
  await page.locator('[data-qa="first_name"]').fill(firstName);
  await page.locator('[data-qa="last_name"]').fill(lastName);
  await page.locator('[data-qa="company"]').fill(company);
  await page.locator('[data-qa="address"]').fill(address1);
  await page.locator('[data-qa="address2"]').fill(address2);
  await page.locator('select#country').selectOption({ label: 'United States' });
  await page.locator('[data-qa="state"]').fill(state);
  await page.locator('[data-qa="city"]').fill(city);
  await page.locator('[data-qa="zipcode"]').fill(zipcode);
  await page.locator('[data-qa="mobile_number"]').fill(mobile);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByText('Account Created!')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(page.getByText(`Logged in as ${firstName}`)).toBeVisible();
  // Click 'Cart' button
  await page.getByRole('link', { name: /Cart/i }).click();
  await expect(page).toHaveURL(/view_cart/);
  // Click 'Proceed To Checkout' button
  await page.locator('a', { hasText: 'Proceed To Checkout' }).click();
  // Verify Address Details and Review Your Order
  await expect(page.getByText('Address Details')).toBeVisible();
  await expect(page.getByText('Review Your Order')).toBeVisible();
  // Enter description in comment text area and click 'Place Order'
  await page.locator('textarea[name="message"]').fill('Order placed via automation test.');
  await page.locator('a', { hasText: 'Place Order' }).click();
  // Enter payment details (replace with valid test data if needed)
  await page.locator('[data-qa="name-on-card"]').fill(`${firstName} ${lastName}`);
  await page.locator('[data-qa="card-number"]').fill('4111111111111111');
  await page.locator('[data-qa="cvc"]').fill('123');
  await page.locator('[data-qa="expiry-month"]').fill('12');
  await page.locator('[data-qa="expiry-year"]').fill('2028');
  await page.getByRole('button', { name: /Pay and Confirm Order/i }).click();
  // Verify success message
  await expect(page.getByText('Your order has been placed successfully!')).toBeVisible();
  // Delete account
  await page.getByRole('link', { name: /Delete Account/ }).click();
  await expect(page.getByText('Account Deleted!')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();
});

test('Test Case 16: Place Order: Login before Checkout', async ({ page }) => {
  // Generate dynamic user data
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName, provider: 'example.com' });
  const password = faker.internet.password({ length: 12 });
  const company = faker.company.name();
  const address1 = faker.location.streetAddress();
  const address2 = faker.location.secondaryAddress();
  const state = faker.location.state();
  const city = faker.location.city();
  const zipcode = faker.location.zipCode();
  const mobile = faker.string.numeric(10);

  // Register user
  await page.goto('http://automationexercise.com');
  await page.getByRole('link', { name: 'Signup / Login' }).click();
  await page.locator('[data-qa="signup-name"]').fill(firstName);
  await page.locator('[data-qa="signup-email"]').fill(email);
  await page.getByRole('button', { name: 'Signup' }).click();
  await page.getByLabel('Mr.').check();
  await page.locator('[data-qa="password"]').fill(password);
  await page.locator('select#days').selectOption('10');
  await page.locator('select#months').selectOption({ label: 'May' });
  await page.locator('select#years').selectOption('1990');
  await page.getByLabel('Sign up for our newsletter!').check();
  await page.getByLabel('Receive special offers from our partners!').check();
  await page.locator('[data-qa="first_name"]').fill(firstName);
  await page.locator('[data-qa="last_name"]').fill(lastName);
  await page.locator('[data-qa="company"]').fill(company);
  await page.locator('[data-qa="address"]').fill(address1);
  await page.locator('[data-qa="address2"]').fill(address2);
  await page.locator('select#country').selectOption({ label: 'United States' });
  await page.locator('[data-qa="state"]').fill(state);
  await page.locator('[data-qa="city"]').fill(city);
  await page.locator('[data-qa="zipcode"]').fill(zipcode);
  await page.locator('[data-qa="mobile_number"]').fill(mobile);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(page.getByText(`Logged in as ${firstName}`)).toBeVisible();

  // Add products to cart
  await page.getByRole('link', { name: /Products/i }).click();
  await page.locator('.features_items .product-image-wrapper').first().hover();
  await page.locator('.features_items .product-image-wrapper').first().locator('.productinfo .btn.add-to-cart').click();
  await page.getByRole('button', { name: /Continue Shopping/i }).click();
  // Click 'Cart' button
  await page.getByRole('link', { name: /Cart/i }).click();
  await page.locator('a', { hasText: 'Proceed To Checkout' }).click();
  // Verify Address Details and Review Your Order
  await expect(page.getByText('Address Details')).toBeVisible();
  await expect(page.getByText('Review Your Order')).toBeVisible();
  // Enter description in comment text area and click 'Place Order'
  await page.locator('textarea[name="message"]').fill('Order placed via automation test.');
  await page.locator('a', { hasText: 'Place Order' }).click();
  // Enter payment details
  await page.locator('[data-qa="name-on-card"]').fill(`${firstName} ${lastName}`);
  await page.locator('[data-qa="card-number"]').fill('4111111111111111');
  await page.locator('[data-qa="cvc"]').fill('123');
  await page.locator('[data-qa="expiry-month"]').fill('12');
  await page.locator('[data-qa="expiry-year"]').fill('2028');
  await page.getByRole('button', { name: /Pay and Confirm Order/i }).click();
  await expect(page.getByText('Your order has been placed successfully!')).toBeVisible();
  // Delete account
  await page.getByRole('link', { name: /Delete Account/ }).click();
  await expect(page.getByText('Account Deleted!')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();
});

test('Test Case 17: Remove Products From Cart', async ({ page }) => {
  await page.goto('http://automationexercise.com');
  await page.getByRole('link', { name: /Products/i }).click();
  await page.locator('.features_items .product-image-wrapper').first().hover();
  await page.locator('.features_items .product-image-wrapper').first().locator('.productinfo .btn.add-to-cart').click();
  await page.getByRole('button', { name: /Continue Shopping/i }).click();
  await page.locator('.features_items .product-image-wrapper').nth(1).hover();
  await page.locator('.features_items .product-image-wrapper').nth(1).locator('.productinfo .btn.add-to-cart').click();
  await page.locator('a', { hasText: 'View Cart' }).click();
  await expect(page).toHaveURL(/view_cart/);
  // Remove first product
  await page.locator('a.cart_quantity_delete').first().click();
  // Verify that product is removed from the cart
  await expect(page.locator('tr.cart_product')).toHaveCount(1);
});

test('Test Case 18: View Category Products', async ({ page }) => {
  await page.goto('http://automationexercise.com');
  // Verify that categories are visible on left side bar
  await expect(page.locator('.left-sidebar .panel-group')).toBeVisible();
  // Click on 'Women' category
  await page.getByRole('link', { name: /Women/i }).click();
  // Click on any category link under 'Women' (e.g., Dress)
  await page.locator('.panel-group .panel .panel-collapse .panel-body ul li a').first().click();
  // Verify that category page is displayed and confirm text 'WOMEN - TOPS PRODUCTS'
  await expect(page.getByRole('heading', { name: /Women/i })).toBeVisible();
  // On left side bar, click on any sub-category link of 'Men' category
  await page.getByRole('link', { name: /Men/i }).click();
  await page.locator('.panel-group .panel .panel-collapse .panel-body ul li a').first().click();
  // Verify that user is navigated to that category page
  await expect(page.getByRole('heading', { name: /Men/i })).toBeVisible();
});

test('Test Case 19: View & Cart Brand Products', async ({ page }) => {
  await page.goto('http://automationexercise.com');
  await page.getByRole('link', { name: /Products/i }).click();
  // Verify that Brands are visible on left side bar
  await expect(page.locator('.brands_products')).toBeVisible();
  // Click on any brand name
  await page.locator('.brands-name a').first().click();
  // Verify that user is navigated to brand page and brand products are displayed
  await expect(page.locator('.features_items')).toBeVisible();
  // On left side bar, click on any other brand link
  await page.locator('.brands-name a').nth(1).click();
  // Verify that user is navigated to that brand page and can see products
  await expect(page.locator('.features_items')).toBeVisible();
});

test('Test Case 20: Search Products and Verify Cart After Login', async ({ page }) => {
  // Generate dynamic user data
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName, provider: 'example.com' });
  const password = faker.internet.password({ length: 12 });
  // Register user
  await page.goto('http://automationexercise.com');
  await page.getByRole('link', { name: 'Signup / Login' }).click();
  await page.locator('[data-qa="signup-name"]').fill(firstName);
  await page.locator('[data-qa="signup-email"]').fill(email);
  await page.getByRole('button', { name: 'Signup' }).click();
  await page.getByLabel('Mr.').check();
  await page.locator('[data-qa="password"]').fill(password);
  await page.locator('select#days').selectOption('10');
  await page.locator('select#months').selectOption({ label: 'May' });
  await page.locator('select#years').selectOption('1990');
  await page.getByLabel('Sign up for our newsletter!').check();
  await page.getByLabel('Receive special offers from our partners!').check();
  await page.locator('[data-qa="first_name"]').fill(firstName);
  await page.locator('[data-qa="last_name"]').fill(lastName);
  await page.locator('[data-qa="company"]').fill(faker.company.name());
  await page.locator('[data-qa="address"]').fill(faker.location.streetAddress());
  await page.locator('[data-qa="address2"]').fill(faker.location.secondaryAddress());
  await page.locator('select#country').selectOption({ label: 'United States' });
  await page.locator('[data-qa="state"]').fill(faker.location.state());
  await page.locator('[data-qa="city"]').fill(faker.location.city());
  await page.locator('[data-qa="zipcode"]').fill(faker.location.zipCode());
  await page.locator('[data-qa="mobile_number"]').fill(faker.string.numeric(10));
  await page.getByRole('button', { name: 'Create Account' }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(page.getByText(`Logged in as ${firstName}`)).toBeVisible();
  // Search for a product
  await page.getByRole('link', { name: /Products/i }).click();
  await page.locator('[data-qa="search-product"]').fill('dress');
  await page.locator('[data-qa="search-button"]').click();
  await expect(page.getByText('Searched Products')).toBeVisible();
  // Add those products to cart
  const products = await page.locator('.features_items .product-image-wrapper');
  const count = await products.count();
  for (let i = 0; i < count; i++) {
    await products.nth(i).hover();
    await products.nth(i).locator('.productinfo .btn.add-to-cart').click();
    // If modal appears, click Continue Shopping
    if (await page.getByRole('button', { name: /Continue Shopping/i }).isVisible()) {
      await page.getByRole('button', { name: /Continue Shopping/i }).click();
    }
  }
  // Click 'Cart' button and verify that products are visible in cart
  await page.getByRole('link', { name: /Cart/i }).click();
  await expect(page).toHaveURL(/view_cart/);
  await expect(page.locator('tr.cart_product')).toHaveCount(count);
  // Logout
  await page.getByRole('link', { name: 'Logout' }).click();
  // Login again
  await page.getByRole('link', { name: 'Signup / Login' }).click();
  await page.locator('[data-qa="login-email"]').fill(email);
  await page.locator('[data-qa="login-password"]').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  // Again, go to Cart page
  await page.getByRole('link', { name: /Cart/i }).click();
  await expect(page).toHaveURL(/view_cart/);
  // Verify that those products are visible in cart after login as well
  await expect(page.locator('tr.cart_product')).toHaveCount(count);
});

test('Test Case 21: Add review on product', async ({ page }) => {
  const name = faker.person.fullName();
  const email = faker.internet.email();
  const review = faker.lorem.sentences(2);
  await page.goto('http://automationexercise.com');
  await page.getByRole('link', { name: /Products/i }).click();
  await page.locator('a[href^="/product_details/"]').first().click();
  await expect(page.getByText('Write Your Review')).toBeVisible();
  await page.locator('[data-qa="review-name"]').fill(name);
  await page.locator('[data-qa="review-email"]').fill(email);
  await page.locator('[data-qa="review-text"]').fill(review);
  await page.getByRole('button', { name: /Submit/i }).click();
  await expect(page.getByText('Thank you for your review.')).toBeVisible();
});

test('Test Case 22: Add to cart from Recommended items', async ({ page }) => {
  await page.goto('http://automationexercise.com');
  // Scroll to bottom of page
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  // Verify 'RECOMMENDED ITEMS' are visible
  await expect(page.getByText('Recommended Items', { exact: false })).toBeVisible();
  // Click on 'Add To Cart' on Recommended product
  await page.locator('.recommended_items .product-image-wrapper').first().hover();
  await page.locator('.recommended_items .product-image-wrapper').first().locator('.productinfo .btn.add-to-cart').click();
  // Click on 'View Cart' button
  await page.locator('a', { hasText: 'View Cart' }).click();
  await expect(page).toHaveURL(/view_cart/);
  // Verify that product is displayed in cart page
  await expect(page.locator('tr.cart_product')).toHaveCount(1);
});

test('Test Case 23: Verify address details in checkout page', async ({ page }) => {
  // Generate dynamic user data
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName, provider: 'example.com' });
  const password = faker.internet.password({ length: 12 });
  const company = faker.company.name();
  const address1 = faker.location.streetAddress();
  const address2 = faker.location.secondaryAddress();
  const state = faker.location.state();
  const city = faker.location.city();
  const zipcode = faker.location.zipCode();
  const mobile = faker.string.numeric(10);

  await page.goto('http://automationexercise.com');
  await page.getByRole('link', { name: 'Signup / Login' }).click();
  await page.locator('[data-qa="signup-name"]').fill(firstName);
  await page.locator('[data-qa="signup-email"]').fill(email);
  await page.getByRole('button', { name: 'Signup' }).click();
  await page.getByLabel('Mr.').check();
  await page.locator('[data-qa="password"]').fill(password);
  await page.locator('select#days').selectOption('10');
  await page.locator('select#months').selectOption({ label: 'May' });
  await page.locator('select#years').selectOption('1990');
  await page.getByLabel('Sign up for our newsletter!').check();
  await page.getByLabel('Receive special offers from our partners!').check();
  await page.locator('[data-qa="first_name"]').fill(firstName);
  await page.locator('[data-qa="last_name"]').fill(lastName);
  await page.locator('[data-qa="company"]').fill(company);
  await page.locator('[data-qa="address"]').fill(address1);
  await page.locator('[data-qa="address2"]').fill(address2);
  await page.locator('select#country').selectOption({ label: 'United States' });
  await page.locator('[data-qa="state"]').fill(state);
  await page.locator('[data-qa="city"]').fill(city);
  await page.locator('[data-qa="zipcode"]').fill(zipcode);
  await page.locator('[data-qa="mobile_number"]').fill(mobile);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(page.getByText(`Logged in as ${firstName}`)).toBeVisible();
  // Add products to cart
  await page.getByRole('link', { name: /Products/i }).click();
  await page.locator('.features_items .product-image-wrapper').first().hover();
  await page.locator('.features_items .product-image-wrapper').first().locator('.productinfo .btn.add-to-cart').click();
  await page.getByRole('button', { name: /Continue Shopping/i }).click();
  // Click 'Cart' button
  await page.getByRole('link', { name: /Cart/i }).click();
  await page.locator('a', { hasText: 'Proceed To Checkout' }).click();
  // Verify that the delivery address is same address filled at the time registration of account
  await expect(page.locator('#address_delivery').getByText(address1, { exact: false })).toBeVisible();
  await expect(page.locator('#address_delivery').getByText(city, { exact: false })).toBeVisible();
  await expect(page.locator('#address_delivery').getByText(state, { exact: false })).toBeVisible();
  await expect(page.locator('#address_delivery').getByText(zipcode, { exact: false })).toBeVisible();
  await expect(page.locator('#address_delivery').getByText(mobile, { exact: false })).toBeVisible();
  // Verify that the billing address is same address filled at the time registration of account
  await expect(page.locator('#address_invoice').getByText(address1, { exact: false })).toBeVisible();
  await expect(page.locator('#address_invoice').getByText(city, { exact: false })).toBeVisible();
  await expect(page.locator('#address_invoice').getByText(state, { exact: false })).toBeVisible();
  await expect(page.locator('#address_invoice').getByText(zipcode, { exact: false })).toBeVisible();
  await expect(page.locator('#address_invoice').getByText(mobile, { exact: false })).toBeVisible();
  // Delete account
  await page.getByRole('link', { name: /Delete Account/ }).click();
  await expect(page.getByText('Account Deleted!')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();
});

test('Test Case 24: Download Invoice after purchase order', async ({ page }) => {
  // Generate dynamic user data
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName, provider: 'example.com' });
  const password = faker.internet.password({ length: 12 });
  await page.goto('http://automationexercise.com');
  await page.getByRole('link', { name: 'Signup / Login' }).click();
  await page.locator('[data-qa="signup-name"]').fill(firstName);
  await page.locator('[data-qa="signup-email"]').fill(email);
  await page.getByRole('button', { name: 'Signup' }).click();
  await page.getByLabel('Mr.').check();
  await page.locator('[data-qa="password"]').fill(password);
  await page.locator('select#days').selectOption('10');
  await page.locator('select#months').selectOption({ label: 'May' });
  await page.locator('select#years').selectOption('1990');
  await page.getByLabel('Sign up for our newsletter!').check();
  await page.getByLabel('Receive special offers from our partners!').check();
  await page.locator('[data-qa="first_name"]').fill(firstName);
  await page.locator('[data-qa="last_name"]').fill(lastName);
  await page.locator('[data-qa="company"]').fill(faker.company.name());
  await page.locator('[data-qa="address"]').fill(faker.location.streetAddress());
  await page.locator('[data-qa="address2"]').fill(faker.location.secondaryAddress());
  await page.locator('select#country').selectOption({ label: 'United States' });
  await page.locator('[data-qa="state"]').fill(faker.location.state());
  await page.locator('[data-qa="city"]').fill(faker.location.city());
  await page.locator('[data-qa="zipcode"]').fill(faker.location.zipCode());
  await page.locator('[data-qa="mobile_number"]').fill(faker.string.numeric(10));
  await page.getByRole('button', { name: 'Create Account' }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(page.getByText(`Logged in as ${firstName}`)).toBeVisible();
  // Add products to cart
  await page.getByRole('link', { name: /Products/i }).click();
  await page.locator('.features_items .product-image-wrapper').first().hover();
  await page.locator('.features_items .product-image-wrapper').first().locator('.productinfo .btn.add-to-cart').click();
  await page.getByRole('button', { name: /Continue Shopping/i }).click();
  // Click 'Cart' button
  await page.getByRole('link', { name: /Cart/i }).click();
  await page.locator('a', { hasText: 'Proceed To Checkout' }).click();
  // Enter description in comment text area and click 'Place Order'
  await page.locator('textarea[name="message"]').fill('Order placed via automation test.');
  await page.locator('a', { hasText: 'Place Order' }).click();
  // Enter payment details
  await page.locator('[data-qa="name-on-card"]').fill(`${firstName} ${lastName}`);
  await page.locator('[data-qa="card-number"]').fill('4111111111111111');
  await page.locator('[data-qa="cvc"]').fill('123');
  await page.locator('[data-qa="expiry-month"]').fill('12');
  await page.locator('[data-qa="expiry-year"]').fill('2028');
  await page.getByRole('button', { name: /Pay and Confirm Order/i }).click();
  await expect(page.getByText('Your order has been placed successfully!')).toBeVisible();
  // Click 'Download Invoice' button and verify invoice is downloaded successfully.
  // NOTE: Playwright can check for download event, but you may need to set up download path in your config.
  const [ download ] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('a', { hasText: 'Download Invoice' }).click()
  ]);
  // Optionally, check download path: const path = await download.path();
  await expect(download.suggestedFilename()).toContain('invoice');
  // Click 'Continue' button
  await page.getByRole('link', { name: 'Continue' }).click();
  // Delete account
  await page.getByRole('link', { name: /Delete Account/ }).click();
  await expect(page.getByText('Account Deleted!')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();
});

test('Test Case 25: Verify Scroll Up using Arrow button and Scroll Down functionality', async ({ page }) => {
  await page.goto('http://automationexercise.com');
  // Scroll down page to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  // Verify 'SUBSCRIPTION' is visible
  await expect(page.getByText('Subscription', { exact: false })).toBeVisible();
  // Click on arrow at bottom right side to move upward
  await page.locator('a[href="#top"]').click();
  // Verify that page is scrolled up and 'Full-Fledged practice website for Automation Engineers' text is visible on screen
  await expect(page.getByRole('heading', { name: /Full-Fledged practice website/i })).toBeVisible();
});

test('Test Case 26: Verify Scroll Up without Arrow button and Scroll Down functionality', async ({ page }) => {
  await page.goto('http://automationexercise.com');
  // Scroll down page to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  // Verify 'SUBSCRIPTION' is visible
  await expect(page.getByText('Subscription', { exact: false })).toBeVisible();
  // Scroll up page to top
  await page.evaluate(() => window.scrollTo(0, 0));
  // Verify that page is scrolled up and 'Full-Fledged practice website for Automation Engineers' text is visible on screen
  await expect(page.getByRole('heading', { name: /Full-Fledged practice website/i })).toBeVisible();
}); 
