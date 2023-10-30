import { type Role } from './role.interface'
import { type Skill } from './skill.interface'

export interface IResponse {
  data: Partial<{
    Skills: Skill[]
    Roles: Role[]
  }>
}
