export {
  HISTORY,
  MARKETS,
  ORDER_BOOK,
  TICKER_LIST,
};



const TICKER_LIST = {
  DATA: [
    {
      'asset': 'APH',
      'price': 0.00087,
      'volume': 7248482,
      '24H change': -35
    },
    {
      'asset': 'EFI',
      'price': 0.00087,
      'volume': 7248482,
      '24H change': 22
    },
    {
      'asset': 'GAS',
      'price': 0.00087,
      'volume': 7248482,
      '24H change': 145
    },
    {
      'asset': 'MSTR',
      'price': 0.00087,
      'volume': 7248482,
      '24H change': -10
    },
    {
      'asset': 'SCOTT',
      'price': 0.00087,
      'volume': 7248482,
      '24H change': 1.232
    }
  ],
  COLUMNS: ['asset', 'price', 'volume', '24H change'],
}

const ORDER_BOOK = {
  DATA: {
    "type": "bookSnapshot",
    "pair": "GAS-NEO",
    "bids": [
      [
        "3.68",
        "1",
        "0"
      ],
      [
        "3.67",
        "1.100005",
        "0.500000"
      ],
      [
        "1.2",
        "0.833333",
        "0"
      ],
      [
        "1",
        "97.14915881",
        "0.50130000"
      ],
      [
        "0.00428",
        "1",
        "0"
      ]
    ],
    "asks": [
      [
        "3.69",
        "1",
        "0"
      ],
      [
        "3.7",
        "8.5",
        "0.0"
      ],
      [
        "439",
        "2.2",
        "0.0"
      ]
    ]
  }
}
