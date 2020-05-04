import styles from "./category.module.scss"

export function Category({ children }) {
  return <section className={styles.category}>{children}</section>
}
