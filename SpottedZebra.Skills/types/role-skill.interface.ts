import { type Skill } from './skill.interface'

export interface RoleSkill {
  createdAt: string
  deletedAt: string
  id: number
  roleId: number
  skill: Skill
  skillId: number
  updatedAt: string
  weight: number
}
