import { type IAsd } from '../types/asd.interface'

// Skills
export const CREATE_SKILL_WITH_NAME = (name: string): string => {
  return `mutation automation_createSkill { SkillCreateOne(name: "${name}") { id name }}`
}

export const UPDATE_SKILL = (id: number, name: string): string => {
  return `mutation automation_updateSkill_${id} { SkillUpdateOne(id: ${
    id}, name: "${name}") { id name } }`
}

export const DELETE_SKILL_WITH_ID = (id: number): string => {
  return `mutation automation_deleteSkill_${id} {SkillDeleteOne(id: ${id}) { affected } }`
}

// Roles
export const CREATE_ROLE_WITH_NAME = (name: string): string => {
  // This doesn't appear to have a character limit
  // Do you think 60 characters would be appropriate? 'Pre-litigated Motor Team Lead (Maternity Cover - 16 months)'
  return `mutation automation_createRole_${name.split(' ')[0]} { RoleCreateOne(name: "${name}") { id name } }`
}

/**
 * Construct the `RoleSkillsOverwrite` mutation
 * @param {number} id
 * @param {IAsd[]} skills - where the weighting must add to 1
 * @returns {string} - the mutation
 * @example - input format `(roleId: 1, skills: [{ skillId: 1, weight: 0.7 }, { skillId: 2, weight: 0.3 }])`
 */
export const UPDATE_ROLE_WITH_SKILLS = (id: number, skills: IAsd[]): string => {
  // When the mutation is successful, you do not see the role's name
  // Although roleId is validates, skillId is not
  return `mutation automation_updateRole_id_${id
  } { RoleSkillsOverwrite(roleId: ${id}, skills: [{ skillId: ${skills[0].skillId}, weight: 1 }]) { id roleId skill { id name } skillId weight } }`
}

export const UPDATE_ROLE_NAME = (id: number, name: string): string => {
  return `mutation automation_updateRole_name_${name} {
    RoleUpdateOne(id: ${id}, name: ${name}) {
      id
      name
      skills {
        skill {
          id
          name
        }
      }
    }
  }`
}

export const DELETE_ROLE_WITH_ID = (id: number): string => {
  return `mutation automation_deleteRole_${id} {RoleDeleteOne(id: ${id}) { affected } }`
}