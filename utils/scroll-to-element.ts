/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export default function scrollToElement(id: string) {
  const element = document.querySelector(`#${id}`)
  if (!element) return

  const top = element.getBoundingClientRect().top + window.pageYOffset - 10
  window.scrollTo({ top, behavior: 'smooth' })
}
