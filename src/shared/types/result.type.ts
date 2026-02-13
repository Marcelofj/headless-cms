/**
 * Result Type
 * 
 * Representa o resultado de uma operação que pode falhar.
 * 
 * Evita o uso de `throw` como fluxo de domínio.
 * Erros são valores, não exceções.
 * 
 * Uso:
 * ```ts
 * function divide(a: number, b: number): Result<number, string> {
 *   if (b === 0) {
 *     return Err('Division by zero')
 *   }
 *   return Ok(a / b)
 * }
 * 
 * const result = divide(10, 2)
 * if (result.ok) {
 *   console.log(result.value)  // 5
 * } else {
 *   console.log(result.error)  // string
 * }
 * ```
 */
export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E }

/**
 * Cria um Result de sucesso
 */
export const Ok = <T>(value: T): Result<T, never> => ({
  ok: true,
  value
})

/**
 * Cria um Result de erro
 */
export const Err = <E>(error: E): Result<never, E> => ({
  ok: false,
  error
})