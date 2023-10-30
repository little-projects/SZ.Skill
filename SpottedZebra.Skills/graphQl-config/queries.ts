// Skills
export const GET_SKILLS = 'query automation_getSkills { Skills { id name } }'

export const GET_SKILL_WITH_ID = (id: number): string => {
  // { SkillFindOne(id: $id) { id name createdAt } }
  return `query automation_getSkill_id_${id} { SkillFindOne(id: ${id}) { id name } }`
}

export const GET_SKILL_WITH_NAME = (name: string): string => {
  // { SkillFindOne(id: $id) { id name createdAt } }
  return `query automation_getSkill_name_${name.substring(0, 8)} { SkillFindOne(id: ${name}) { id name } }`
}

// Roles
export const GET_ROLES = 'query automation_getRoles { Roles { id name skills { skill { name } weight } } }'

export const GET_ROLE_WITH_ID = (id: number): string => {
  return `query automation_getSRole_id_${id
} { RoleFindOne(id: ${id
}) { id name skills { skill { id name } weight } } }`
}

export const GET_ROLE_WITH_NAME = (name: string): string => {
  return `query automation_getSRole_name_${name
} { RoleFindOne(name: ${name
}) { id name skills { skill { name } weight } } }`
}
