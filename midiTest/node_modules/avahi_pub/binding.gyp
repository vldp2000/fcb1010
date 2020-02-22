{
  'targets': [
    {
      'target_name': 'avahi_pub',
      'conditions': [
        ['OS=="linux"', {
          'sources': [
            'lib/avahi_pub.cc'
          ],
          'cflags': [
            '-fpermissive',
          ],
          'libraries': [
            '-lavahi-client',
            '-lavahi-common'
          ]
        }]
      ]
    }
  ]
}
