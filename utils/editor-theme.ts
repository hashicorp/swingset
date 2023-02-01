/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { PrismTheme } from 'prism-react-renderer'

export default {
  plain: {
    color: 'rgb(233, 233, 233)',
  },
  styles: [
    {
      types: ['prolog', 'comment', 'doctype', 'cdata'],
      style: {
        color: 'rgb(137, 137, 137)',
      },
    },
    {
      types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol'],
      style: { color: '#FEB170' },
    },
    {
      types: ['attr-name', 'string', 'char', 'builtin', 'insterted'],
      style: {
        color: 'hsl(75, 70%, 70%)',
      },
    },
    {
      types: [
        'operator',
        'entity',
        'url',
        'string',
        'variable',
        'language-css',
      ],
      style: {
        color: '#9DDD78',
      },
    },
    {
      types: ['deleted'],
      style: {
        color: 'rgb(255, 85, 85)',
      },
    },
    {
      types: ['italic'],
      style: {
        fontStyle: 'italic',
      },
    },
    {
      types: ['important', 'bold'],
      style: {
        fontWeight: 'bold',
      },
    },
    {
      types: ['regex', 'important'],
      style: {
        color: '#e90',
      },
    },
    {
      types: ['atrule', 'attr-value', 'keyword'],
      style: {
        color: '#9DDD78',
      },
    },
    {
      types: ['punctuation', 'symbol'],
      style: {
        opacity: '0.7',
        color: '#FEB170',
      },
    },
    {
      types: ['operator'],
      style: { color: 'rgb(255, 237, 114)' },
    },
    {
      types: ['class-name'],
      style: { color: '#FF6D7E' },
    },
    {
      types: ['attr-name'],
      style: { color: '#FFED72' },
    },
    { types: ['script'], style: { color: '#AE96E8' } },
  ],
} as PrismTheme

// red: #FF6D7E
// orange: #FEB170
// purple: #AE96E8
// green: #9DDD78
// yellow: #FFED72
// light-blue: #7CD5F1
