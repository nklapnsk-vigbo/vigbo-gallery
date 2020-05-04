import clsx from "clsx"

import styles from "./container.module.scss"

export function Container({ children, fluid }) {
  return <div className={clsx(styles.container, { [styles.fluid]: fluid })}>{children}</div>
}
