import { assert } from 'chai'
import { CREATE_ROLE_WITH_NAME, CREATE_SKILL_WITH_NAME, DELETE_SKILL_WITH_ID, UPDATE_ROLE_WITH_SKILLS } from '../../../../graphQl-config/mutations'
import { GET_ROLE_WITH_ID } from '../../../../graphQl-config/queries'
import { genRandomString } from '../../../../helpers/gen-skills'
import { sendMutation } from '../../../../helpers/graphql'
import { type ICreateRole } from '../../../../types/responses/create-role-response.interface'
import { type ICreateSkill } from '../../../../types/responses/create-skill-response.interface'

it.only('#234 A deleted skill should not be visible on a role', async () => {
  const skillName: string = genRandomString()
  const roleName: string = genRandomString()

  // Create skill and role
  const skillResponse = await sendMutation(CREATE_SKILL_WITH_NAME(skillName)) as ICreateSkill
  console.log('Create a skill: \n', JSON.stringify(skillResponse))
  const skillId: number = skillResponse.data.SkillCreateOne.id

  const roleResponse = await sendMutation(CREATE_ROLE_WITH_NAME(roleName)) as ICreateRole
  console.log('Create a role: \n', JSON.stringify(roleResponse))
  const roleId: number = roleResponse.data.RoleCreateOne.id

  // Add skill to role
  const updateWithSkill: string = UPDATE_ROLE_WITH_SKILLS(roleId, [{ skillId, weight: 1 }])
  const skillAdded = await sendMutation(updateWithSkill)
  console.log('\nAdd the skill to the role: \n', JSON.stringify(skillAdded))

  // Delete skill
  const deleteSkill = await sendMutation(DELETE_SKILL_WITH_ID(skillId))
  console.log(JSON.stringify(deleteSkill))

  // Get updated role to see if skill has been deleted from role
  const updatedRole = await sendMutation(GET_ROLE_WITH_ID(roleId))
  console.log('\nShow updates role: \n', JSON.stringify(updatedRole))

  // Expect skill to show as empty string rather than missing
  assert.equal(updatedRole.data.RoleFindOne.skills[0].skill.id, 0)
  assert.fail('Is this a side-effect of the UPDATE_ROLE_WITH_SKILLS bug?')
}).timeout(8000)
