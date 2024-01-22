const g = document.getElementById.bind(document)

g('uploadButton').addEventListener('click', function () {
  const fileInput = g('fileInput')
  const file = fileInput.files[0]
  const reader = new FileReader()

  reader.onload = function (e) {
    const vCardData = e.target.result

    // Parse the VCF data (pseudo-code, replace with actual parsing logic)
    const contacts = parse(vCardData) // Returns an array of contacts with names and birthdays

    // Process and display birthdays
    displayBirthdays(contacts)
  }

  reader.readAsText(file)
})

const getTextAfter = (str, key) => str.match(`${key}:(.*)\\r\\n`)?.[1] || null

function parse(str) {
  const arr = str.split('END:VCARD').map(v => 'BEGIN:VCARD' + v)
  return arr.map(v => {
    const name = getTextAfter(v, 'FN')
    const birthday = getTextAfter(v, 'BDAY')

    return { name, birthday }
  })
}

dayjs.extend(dayjs_plugin_dayOfYear)

function displayBirthdays(contacts) {
  const sorted = contacts
    .filter(contact => contact.birthday)
    .sort((a, b) => dayjs(a.birthday).dayOfYear() - dayjs(b.birthday).dayOfYear())

  let htmlContent = ''
  sorted.forEach(contact => {
    const bday = dayjs(contact.birthday).set('hour', 12)
    let age = dayjs().year() - bday.year()
    const days = bday.set('year', dayjs().year()).diff(dayjs(), 'day')

    htmlContent += `<div title="${bday}">${contact.name} turns ${age} in ${days} days</div>`
  })

  g('birthdays').innerHTML = htmlContent
}
