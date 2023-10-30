import { type Role } from '../role.interface'
import { type Skill } from '../skill.interface'

export interface IGetAllResponse {
  data: Partial<{
    Skills: Skill[]
    Roles: Role[]
  }>
}
