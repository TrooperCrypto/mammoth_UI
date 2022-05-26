import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { networkSelector } from "lib/store/features/api/apiSlice";
// import { userSelector } from "lib/store/features/auth/authSlice";
import styled from "@emotion/styled";
import { FiChevronDown } from "react-icons/fi";
import { Modal } from "../Modal";
// import { useCoinEstimator, Modal } from "components";
import { formatUSD } from "../../libs/utils";
// import api from "lib/api";
import SearchBox from "../SearchBox/SearchBox";
import _ from "lodash"

const StyledSwapCurrencySelector = styled.div`
  height: 46px;
  padding: 0 10px;
  background: #fff;
  border-radius: 15px;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #fff;
  box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
  user-select: none;

  &:hover {
    border-color: #7b8ab6;
  }

  select {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
  }
`;

const SwapCurrencyWrapper = styled.div`
  position: relative;

  .currencyIcon > img {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }

  .currencyName {
    flex: 1 1 auto;
    margin-left: 8px;
    font-size: 15px;
    color: #333;

    svg {
      position: relative;
      top: -1px;
      margin-left: 5px;
    }
  }
`;

const SwapCurrencyOptions = styled.ul`
  width: 100%;
  overflow: auto;
  padding: 0;
  font-size: 16px;
  cursor: pointer;
  color: wheat;

  & img {
    width: 28px;
    height: 28px;
    object-fit: contain;
    margin-right: 13px;
  }

  .currencyBalance {
    line-height: 1.1;
    text-align: right;
    margin-left: auto;

    strong {
      display: block;
      font-weight: 600;
      font-family: "Iceland", sans-serif;
      font-size: 18px;
      color: #69f;
    }

    small {
      font-size: 12px;
    }
  }

  .currencyOption {
    display: flex;
    padding: 13px;
    flex-direction: row;
    align-items: center;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    margin-bottom: 10px;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
`;

interface Props{
  onChange: (e:any)=>void;
  currencies: any;
  balances: any;
  value: string;
}

const SwapCurrencySelector = ({
  onChange,
  currencies,
  balances = {},
  value,
}: Props) => {
  const [show, setShow] = useState(false);
  const [showingOptions, setShowingOptions] = useState(false);
  // const network = useSelector(networkSelector);
  // const user = useSelector(userSelector);
  // const coinEstimator = useCoinEstimator();

  const [availableTickers, setTickers] = useState(['USDC', 'ZZUSDC', 'LUNA']);

  // useEffect(() => {
  //   onChange(api.marketInfo["ETH"] ? "ETH" : tickers[0]);
  // }, [user.id, network, currencies]);

  const hideOptions = (e: any) => {
    if (e) e.preventDefault();
    setShowingOptions(false);
  };

  const getCurrencyLogo = (currency: string) => {
    try {
      return require(`../../assets/images/currency/${currency}.svg`).default;
    } catch (e) {
      try {
        return require(`../../assets/images/currency/${currency}.png`).default;
      } catch (e) {
        try {
          return require(`../../assets/images/currency/${currency}.webp`).default;
        } catch (e) {
          return require(`../../assets/images/currency/YFI.svg`).default;
        }
      }
    }
  }

  useEffect(() => {
    if (showingOptions) {
      window.addEventListener("click", hideOptions, false);
    }

    return () => {
      window.removeEventListener("click", hideOptions);
    };
  }, [showingOptions]);

  if (!value) {
    return null;
  }

  // const currency = api.getCurrencyInfo(value);
  const currency = {};
  const image = getCurrencyLogo(value);

  function searchPair(value: any) {
    // value = value.toUpperCase();

    // if (value !== "") {
    //   var foundPairs = [];

    //   //search tickers
    //   tickers.forEach((ticker) => {
    //     if (ticker.includes(value)) {
    //       foundPairs.push(ticker);
    //     }
    //   });

    //   //set tickers
    //   setTickers(foundPairs);
    // } else {
    //   //reset
    //   setTickers(api.getCurrencies());
    // }
  }

  const selectOption = (ticker: any) => (e: any) => {
    if (e) e.preventDefault();
    onChange(ticker);
  };

  return (
    <SwapCurrencyWrapper>
      <StyledSwapCurrencySelector onClick={() => setShow(true)}>
        <div className="currencyIcon">
          <img src={image && image.default} alt={"img"} />
        </div>
        <div className="currencyName">
          {value}
          <FiChevronDown />
        </div>
      </StyledSwapCurrencySelector>
      <Modal
        title="Select a token to Swap"
        onClose={() => setShow(false)}
        show={show}
      >
        <SearchBox searchPair={searchPair} className="bridge_searchbox" />
        <SwapCurrencyOptions onClick={() => setShow(false)}>
          {_.map(availableTickers, (ticker, key) =>
            ticker === value ? null : (
              <li
                key={key}
                onClick={selectOption(ticker)}
                tabIndex={0}
                className="currencyOption"
              >
                <div className="currencyIcon">
                  <img
                    src={
                      getCurrencyLogo(ticker)
                    }
                    alt={"symbol"}
                  />
                </div>
                <div className="currencyName">{ticker}</div>
                {balances[ticker] && (
                  <div className="currencyBalance">
                    <strong>{balances[ticker].valueReadable}</strong>
                    <small>
                      $
                      {/* {formatUSD(
                        coinEstimator(ticker) * balances[ticker].valueReadable
                      )} */}
                    </small>
                  </div>
                )}
              </li>
            )
          )}
        </SwapCurrencyOptions>
      </Modal>
    </SwapCurrencyWrapper>
  );
};

export default SwapCurrencySelector;
