import { type Role } from '../role.interface'
import { type Skill } from '../skill.interface'

export interface IGetOneResponse {
  data: Partial<{
    SkillFindOne: Skill
    RoleFindOne: Role
  }>
}
