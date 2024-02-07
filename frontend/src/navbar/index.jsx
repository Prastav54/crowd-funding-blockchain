import { ConnectButton } from "web3uikit";

export const NavBar = () => {
  return (
    <div className="sticky top-0 z-10 bg-white space-y-2">
      <div className="flex justify-between border-b  border-[#E1E6EF] p-3 items-center">
        <div>
          <b>Crowd Funding</b>
        </div>
        <div className="flex space-x-3 items-center">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
