import { v4 as uuid_v4 } from "uuid"

export function generate_id() {
	return uuid_v4()
}
