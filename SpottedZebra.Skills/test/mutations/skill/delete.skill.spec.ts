import { assert } from 'chai'
import { sendMutation } from '../../../helpers/graphql'

import { CREATE_SKILL_WITH_NAME, DELETE_SKILL_WITH_ID } from '../../../graphQl-config/mutations'
import { type ICreateSkill } from '../../../types/responses/create-skill-response.interface'
import { type IDeleteResult } from '../../../types/delete-result.interface'

describe('PUT SkillDeleteOne: Users can delete an individual skill by ID', async () => {
  it('The affected count is zero when a skill by the provided ID does not exist', async () => {
    const invalidId: number = 98765432
    const response = await sendMutation(DELETE_SKILL_WITH_ID(invalidId)) as IDeleteResult

    assert.equal(response.data.SkillDeleteOne.affected, 0)
  })

  it('The affected count is one when a skill by the provided ID exists', async () => {
    const createSkill = await sendMutation(CREATE_SKILL_WITH_NAME('Juggling')) as ICreateSkill
    const skillId: number = createSkill.data.SkillCreateOne.id

    const response = await sendMutation(DELETE_SKILL_WITH_ID(skillId)) as IDeleteResult
    assert.equal(response.data.SkillDeleteOne.affected, 1)
  })

  it('The SkillDeleteOne query errors if a string value is sent')
})
