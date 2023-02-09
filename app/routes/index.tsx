import { ActionArgs, json, TypedResponse } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { InputDefinition, validateServerFormData } from "remix-validity-state";
import invariant from "tiny-invariant";

type ActionData = {
	fields?: {
		email: string
	}
	formError?: string
	fieldErrors?: {
		email: string | undefined
	}
}

const badRequest = <T,>(data: T) => json<T>(data, { status: 400 })

type FormValidations = {
	inputs: {
		email: InputDefinition
	}
}

const formValidations: FormValidations = {
	inputs: {
		email: {
			validationAttrs: {
				type: 'email',
				required: true
			}
		}
	}
}

export const action = async ({ request }: ActionArgs): Promise<TypedResponse<ActionData | never>> => {
	// Parse form data
	const { valid, submittedValues: { email } } = await validateServerFormData(await request.formData(), formValidations)
	if (!valid) {
		throw badRequest<ActionData>({ formError: `Form not submitted correctly` })
	}

	invariant(typeof email === 'string', 'Email')

	return json({ fields: { email } })
}

const Index = () => {
	const actionData = useActionData<ActionData>()
	return <Form method="post">
		<input type="email" name="email" {...formValidations.inputs.email.validationAttrs} />
		<button type="submit">Submit</button>
		<p>Email: {actionData?.fields?.email}</p>
	</Form>
}

export default Index
