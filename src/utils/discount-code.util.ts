export function generateDiscountCode(): string {
	return `DISCOUNT10-${new Date().getTime()}`;
}
