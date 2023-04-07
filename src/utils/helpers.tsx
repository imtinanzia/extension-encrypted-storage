import CryptoJS from "crypto-js";

const generateSecret = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let secret = "";
  for (let i = 0; i < length; i++) {
    secret += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return secret;
};

const encryptSecret = (secret: string, password: string): string => {
  const salt = CryptoJS.lib.WordArray.random(16); // generate a random salt
  const key = CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32 }); // generate a 256-bit key using PBKDF2
  const iv = CryptoJS.lib.WordArray.random(16); // generate a random initialization vector
  const encrypted = CryptoJS.AES.encrypt(secret, key, { iv: iv }); // encrypt the secret using AES
  return salt.toString() + iv.toString() + encrypted.toString(); // return the concatenated string
};

const decryptSecret = (ciphertext: string, password: string): string => {
  const salt = CryptoJS.enc.Hex.parse(ciphertext.substr(0, 32)); // extract the salt from the ciphertext
  const iv = CryptoJS.enc.Hex.parse(ciphertext.substr(32, 32)); // extract the initialization vector from the ciphertext
  const encrypted = ciphertext.substring(64); // extract the encrypted secret from the ciphertext
  const key = CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32 }); // generate a 256-bit key using PBKDF2
  const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv }); // decrypt the secret using AES

  return decrypted.toString(CryptoJS.enc.Utf8); // return the decrypted secret as a string
};

const resetApp = (): void => {
  chrome.storage.local.remove(["secret", "passwordHash"], function () {
    console.log("App state reset successfully!");
  });
};

const regenerateSecret = (
  setSecret: React.Dispatch<React.SetStateAction<string>>
): void => {
  chrome.storage.local.get(["passwordHash", "salt"], function (result) {
    const password = result.passwordHash;

    const newSecret = generateSecret(32);
    const encryptedSecret = encryptSecret(newSecret, password);
    chrome.storage.local.set({ secret: encryptedSecret }, function () {
      setSecret(newSecret);
    });
  });
};

const signIn = async (
  password: string,
  setSignedIn: React.Dispatch<React.SetStateAction<boolean>>,
  setSecret: React.Dispatch<React.SetStateAction<string>>
): Promise<void> => {
  chrome.storage.local.get(["secret", "passwordHash", "salt"], (result) => {
    const storedPasswordHash = result.passwordHash;
    const storedSecret = result.secret;
    const salt = CryptoJS.enc.Hex.parse(result.salt);

    const enteredPasswordHash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
    }).toString();
    if (storedPasswordHash === enteredPasswordHash) {
      try {
        const decryptedSecret = decryptSecret(storedSecret as string, password);
        setSignedIn(true);
        localStorage.setItem("secrect", result.secret.slice(0, 32));
        setSecret(decryptedSecret ?? "");
      } catch (error) {
        alert("Error: could not decrypt secret");
      }
    } else {
      alert("Error: incorrect password");
    }
  });
};

const initializeApp = (
  setSecret: React.Dispatch<React.SetStateAction<string>>
): void => {
  chrome.storage.local.get(["secret", "passwordHash"], (result) => {
    if (result.secret && result.passwordHash) {
      // App already initialized
      setSecret(result.secret);
      return;
    }

    // App not initialized
    const secret = generateSecret(32);
    const password = prompt("Please set a password for the app:");
    const passwordConfirmation = prompt("Please confirm your password:");

    if (password !== passwordConfirmation) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    const salt = CryptoJS.lib.WordArray.random(16);
    const passwordHash = CryptoJS.PBKDF2(password ?? "", salt, {
      keySize: 256 / 32,
    }).toString();

    const encryptedSecret = encryptSecret(secret, password as string);
    chrome.storage.local.set(
      {
        secret: encryptedSecret,
        passwordHash: passwordHash,
        salt: salt.toString(),
      },
      () => console.log("App initialized successfully!")
    );
  });
};

export {
  generateSecret,
  decryptSecret,
  encryptSecret,
  resetApp,
  regenerateSecret,
  signIn,
  initializeApp,
};
