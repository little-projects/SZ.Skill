export interface IUpdateSkillResponse {
  data: {
    SkillCreateOne: {
      createdAt: string
      updatedAt: string | null
      deletedAt: string | null
      id: number
      name: string
    }
  }
}
