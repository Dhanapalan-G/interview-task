export function generateEntityId(prefix: string): string {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const length = 25;
  let id = `${prefix}_01`;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters[randomIndex];
  }

  return id;
}
