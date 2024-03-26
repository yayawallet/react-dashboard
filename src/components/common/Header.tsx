import yayawalletLogo from '../../assets/yayawallet-brand.svg'

const Header = () => {
  return (
    <div className="shadow-sm">
      <header className="flex justify-between px-4">
        <img src={yayawalletLogo} width={120} alt="" />

        <ul className="flex text-lg">
          <li className="hover:bg-blue-50 flex items-center">
            <a href="#" className="font-semibold text-blue-800 p-4">
              Dashboard
            </a>
          </li>
        </ul>
      </header>
    </div>
  )
}

export default Header
