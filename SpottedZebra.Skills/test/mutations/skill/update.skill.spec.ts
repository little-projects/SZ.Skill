import { sendMutation, sendQuery } from '../../../helpers/graphql'
import { assert } from 'chai'

import { type IGetOneResponse } from '../../../types/responses/get-one-response.interface'
import { type IError } from '../../../types/responses/error.interface'

import { skillsArray } from '../../../fixtures/skills'

import { GET_SKILL_WITH_ID } from '../../../graphQl-config/queries'
import { CREATE_SKILL_WITH_NAME, UPDATE_SKILL } from '../../../graphQl-config/mutations'
import { ExpectedErrors } from '../../../types/expected-errors.enum'
import { type IUpdateSkillResponse } from '../../../types/responses/update-skill-response.interface'
import { Schema } from '../../../types/schema.enum'
import { type ICreateSkill } from '../../../types/responses/create-skill-response.interface'
import { genRandomString } from '../../../helpers/gen-skills'

describe('PUT SkillDeleteOne: Users can update an individual skill', async () => {
  let skillId: number
  let skillName: string

  // Create a skill to be updated
  beforeEach(async () => {
    skillName = skillsArray[Math.floor(Math.random() * skillsArray.length)]
    const createSkillResponse = await sendMutation(CREATE_SKILL_WITH_NAME(skillName)) as ICreateSkill
    skillId = createSkillResponse.data.SkillCreateOne.id
  })

  it('A skill can be updated if it already exists', async () => {
    const skillPrompt: string = 'wheedle'
    const response = await sendMutation(UPDATE_SKILL(skillId, skillPrompt)) as IUpdateSkillResponse

    assert.equal(response.data.SkillCreateOne.id, skillId)
    assert.equal(response.data.SkillCreateOne.name, skillPrompt)
  })

  it('A skill cannot be updated unless it already exists', async () => {
    const invalidSkillId: number = 1234567899009876543221
    const skillPrompt: string = 'Dubious'
    const response = await sendMutation(UPDATE_SKILL(invalidSkillId, skillPrompt)) as IError

    assert.equal(response.data, { [Schema.SkillDeleteOne]: null })
    assert.equal(response.errors.length, 1)
    assert.equal(response.errors[0].message, ExpectedErrors.ERROR_OCCURED)
  })

  it('A skill cannot be updated to share a name with an existing skill', async () => {
    const response = await sendMutation(UPDATE_SKILL(skillId, skillName)) as IError

    assert.equal(response.data, { [Schema.SkillDeleteOne]: null })
    assert.equal(response.errors.length, 1)
    assert.equal(response.errors[0].message, ExpectedErrors.ERROR_OCCURED)
  })

  it('A skills ID cannot be updated', async () => {
    const response = await sendMutation(UPDATE_SKILL(skillId - 1, skillName)) as IError

    assert.equal(response.data, { [Schema.SkillDeleteOne]: null })
    assert.equal(response.errors.length, 1)
    assert.equal(response.errors[0].message, ExpectedErrors.ERROR_OCCURED)
  })

  it('A skills createdAt time must not equal its updatedAt time', async () => {
    const skillPrompt: string = genRandomString()
    const response = await sendMutation(UPDATE_SKILL(skillId, skillPrompt)) as IUpdateSkillResponse

    assert.notEqual(response.data.SkillCreateOne.createdAt, response.data.SkillCreateOne.updatedAt)
  })

  it('A skills name can be updated without change', async () => {
    const getSkillDetails: string = GET_SKILL_WITH_ID(skillId)
    const skillDetailsQuery: string = getSkillDetails.replace('{ id name }', '{ id name createdAt updatedAt }')

    const createdSkill = await sendQuery(skillDetailsQuery) as IGetOneResponse
    const createdSkillDetails = {
      id: createdSkill.data.SkillFindOne?.id,
      name: createdSkill.data.SkillFindOne?.name,
      createdAt: createdSkill.data.SkillFindOne?.createdAt
    }

    const updatedSkill = await sendMutation(UPDATE_SKILL(skillId, skillName)) as IUpdateSkillResponse
    const updatedSkillDetails = { // Returns SkillCreateOne rather than SkillUpdateOne from the mutation
      id: updatedSkill.data.SkillCreateOne?.id,
      name: updatedSkill.data.SkillCreateOne?.name,
      createdAt: updatedSkill.data.SkillCreateOne?.createdAt
    }

    assert.deepEqual(createdSkillDetails, updatedSkillDetails)
    assert.equal(createdSkill.data.SkillFindOne?.updatedAt, updatedSkill.data.SkillCreateOne?.updatedAt)
  })

  it.skip('A skill that has been created / updated will not have a deletedAt date')

  // https://www.freecodecamp.org/news/how-to-validate-a-date-in-javascript/#:~:text=To%20validate%20if%20a%20string,the%20string%20as%20its%20argument.&text=Note%20that%20the%20Date(),also%20returns%20an%20Invalid%20Date%20.
  it.skip('A skills updatedAt property must be a valid date');

  ['length', 'special characters', 'trailing spaces', 'leading spaces'].forEach((skillNameRule: string) => {
    it.skip(`A skills name cannot break any of the create validation rules - ${skillNameRule}`)
  })
})
