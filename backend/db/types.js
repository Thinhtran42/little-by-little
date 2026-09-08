/**
 * Shared JavaScript contracts for editor completion. No runtime dependency.
 * @typedef {{ rows: Array<Record<string, any>> }} QueryResult
 * @typedef {{ query: (sql: string, params?: any[]) => Promise<QueryResult>, exec?: (sql: string) => Promise<any> }} Connection
 * @typedef {Connection & {
 *   kind: string,
 *   dialect: 'postgresql',
 *   transaction: <T>(work: (tx: Connection) => Promise<T>) => Promise<T>,
 *   close: () => Promise<void>
 * }} Database
 * @typedef {{ id: string, email: string, role: 'learner' | 'admin' }} Actor
 */
export {};
