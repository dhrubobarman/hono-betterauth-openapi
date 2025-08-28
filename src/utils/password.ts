export const hashPassword = async (password: string) => {
  const hash = await Bun.password.hash(password, {
    algorithm: "argon2id",
  });
  return hash;
};

export const verifyPassword = async ({
  hash,
  password,
}: {
  hash: string;
  password: string;
}) => {
  return await Bun.password.verify(password, hash);
};
