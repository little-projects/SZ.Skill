import { assert } from 'chai'

import { sendMutation, sendQuery } from '../../../helpers/graphql'
import { CREATE_SKILL_WITH_NAME, DELETE_SKILL_WITH_ID } from '../../../graphQl-config/mutations'
import { GET_SKILL_WITH_ID } from '../../../graphQl-config/queries'
import { type IGetOneResponse } from '../../../types/responses/get-one-response.interface'
import { skillsArray as skillsList } from '../../../fixtures/skills'
import { type ICreateSkill } from '../../../types/responses/create-skill-response.interface'
import { genRandomString } from '../../../helpers/gen-skills'
import { type IError } from '../../../types/responses/error.interface'

describe('GET SkillFindOne: Users can query an individual skill', async () => {
  // const skillName: string = skillsList[Math.floor(Math.random() * skillsList.length)]
  const skillName: string = genRandomString(2)
  let skillId: number

  // Create the data used in the tests
  before(async () => {
    const mutation = CREATE_SKILL_WITH_NAME(skillName)
    const createSkillResponse = await sendMutation(mutation) as ICreateSkill
    skillId = createSkillResponse.data.SkillCreateOne.id
  })

  after(async () => {
    await sendMutation(DELETE_SKILL_WITH_ID(skillId))
  })

  it('The SkillFindOne query returns data for the provided valid ID', async () => {
    const validQuery: string = GET_SKILL_WITH_ID(skillId)
    const response = await sendQuery(validQuery) as IGetOneResponse

    assert.equal(response.data.SkillFindOne?.id, skillId)
    assert.equal(response.data.SkillFindOne?.name, skillName)
  })

  // True regardless of a positive or negative number
  it('The returned skill can be null if an invalid numeric ID is provided', async () => {
    const validQueryWithInvalidId: string = GET_SKILL_WITH_ID(235689)
    const response = await sendQuery(validQueryWithInvalidId) as IGetOneResponse

    assert.equal(response.data.SkillFindOne, null)
  })

  it('The SkillFindOne query errors if a string value is sent', async () => {
    const randomWord: string = 'Mary_Lilly'// genRandomSkillsString();
    const queryWithWordId: string = GET_SKILL_WITH_ID(randomWord as any)
    const response = await sendQuery(queryWithWordId) as IError

    assert.equal(
      response.errors[0].message,
      `Argument "id" has invalid value ${randomWord}.\nExpected type \"Int\", found ${randomWord}.`
    )
  })
})
