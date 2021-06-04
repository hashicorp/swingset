export default function scrollToElement(id) {
  const top =
    document.querySelector(`#${id}`).getBoundingClientRect().top +
    window.pageYOffset -
    10
  window.scrollTo({ top, behavior: 'smooth' })
}
