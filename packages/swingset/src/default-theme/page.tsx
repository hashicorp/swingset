/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export default async function Page({
  data,
  content,
}: {
  data: any
  content: React.ReactNode
}) {
  return (
    <>
      <h1>{data?.frontmatter?.title ?? data?.slug}</h1>
      <p>{data?.frontmatter?.description}</p>
      {content}
    </>
  )
}
