import clsx from "clsx"

import styles from "./gallery.module.scss"

export function Gallery({ children }) {
  return <section className={clsx(styles.gallery)}>{children}</section>
}
