import { type RoleSkill } from './role-skill.interface'

export interface Role {
  createdAt: string
  deletedAt: string
  id: number
  name: string
  skills: RoleSkill[]
  updatedAt: string
}
