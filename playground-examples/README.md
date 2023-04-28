## Node.js Password Authentication Script using bcrypt

This Node.js script utilizes the bcrypt library to hash and compare passwords. Here's a breakdown of what each function does:

- `isValidPassword(password, hash)`: This function takes a plain-text password and a hashed password and uses `bcrypt.compare()` to determine if they match. It returns a Promise that resolves to a boolean value indicating whether or not the passwords match.

- `hashPassword(password, saltRounds = 8)`: This function takes a plain-text password and an optional number of salt rounds (defaulting to 8) and uses `bcrypt.hash()` to hash the password with the specified number of salt rounds. It returns a Promise that resolves to the hashed password.

- `tester(plainTextPassword, saltRounds = 8, shouldMatch = true)`: This function is used to test the `hashPassword()` and `isValidPassword()` functions. It takes a plain-text password, an optional number of salt rounds (defaulting to 8), and an optional boolean value indicating whether the function should test a good or bad password (defaulting to true). The function first hashes the password using `hashPassword()`, then splits the resulting hashed password string into its algorithm, cost, salt, and hash components. It then logs information about each component to the console for debugging purposes. Finally, it uses `isValidPassword()` to test whether the original plain-text password or a modified version of it (depending on the `shouldMatch` argument) matches the hashed password, and logs the result to the console.

This script is useful for implementing password authentication in a Node.js application, and it follows best practices by using a secure password hashing algorithm with a salt.
