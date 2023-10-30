import { faker } from '@faker-js/faker'

export function genRandomString (length: number = 1): string {
  let randomString: string = faker.music.songName()
  for (let i = 1; i < length; i++) {
    randomString = randomString + faker.music.songName()
  }

  return randomString
}
