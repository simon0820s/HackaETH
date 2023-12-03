import dotenv from "dotenv"
dotenv.config()

export const cUSD_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
export const ONE_MILLION = BigInt(100_000 * 10 ** 18)

type Users = {
    [key: string]: {
        publicKey: string | undefined,
        privateKey: string | undefined,
        mnemonic: string | undefined
    }
}
export const users: Users = {
    lpA: {
        publicKey: process.env.USER_1_PRIVATE,
        privateKey: process.env.USER_1_PUBLIC,
        mnemonic: process.env.USER_1_MNEMONIC
    },
    lpB: {
        publicKey: process.env.USER_2_PRIVATE,
        privateKey: process.env.USER_2_PUBLIC,
        mnemonic: process.env.USER_2_MNEMONIC
    },
    lpC: {
        publicKey: process.env.USER_3_PRIVATE,
        privateKey: process.env.USER_3_PUBLIC,
        mnemonic: process.env.USER_3_MNEMONIC
    },
    user1: {
        publicKey: process.env.USER_4_PRIVATE,
        privateKey: process.env.USER_4_PUBLIC,
        mnemonic: process.env.USER_4_MNEMONIC
    },
    user2: {
        publicKey: process.env.USER_5_PRIVATE,
        privateKey: process.env.USER_5_PUBLIC,
        mnemonic: process.env.USER_5_MNEMONIC
    }
}
