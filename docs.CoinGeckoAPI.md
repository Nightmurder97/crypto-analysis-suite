
# CoinGecko API Briefing Document

## 1. Introduction to CoinGecko API

The CoinGecko API provides comprehensive access to cryptocurrency and blockchain data, serving various user needs from simple price queries to detailed historical and on-chain analytics. It offers both a public (demo) API and a Pro API for paid plan subscribers, with the latter providing a more extensive range of exclusive endpoints and historical data access. The API is designed to be accessible via standard HTTP requests and supports various programming languages like Python, Node, Ruby, and PHP.

**Key takeaway:** The CoinGecko API is a robust data source for cryptocurrency information, categorized into Coins, NFTs, Exchanges & Derivatives, General, and Onchain DEX (GeckoTerminal) endpoints, with different access tiers.

## 2. API Key and Authentication

While the public/demo API has certain limitations (e.g., historical data restricted to the past 365 days), full access to the complete range of historical data and exclusive endpoints requires a Pro-API key, obtained through a paid subscription. The documentation also mentions credentials like x-cg-demo-api-key for authentication in examples.

**Key takeaway:** An API key is required for full functionality, distinguishing between public/demo and paid (Pro-API) access.

## 3. Core Data Categories and Endpoints

The CoinGecko API organizes its data into several major categories, each with specific endpoints to retrieve relevant information:

### 3.1. Coins Endpoint

This is a central part of the API, providing extensive data about various cryptocurrencies.

* **/ping** : Checks API server status. Response: {"gecko_says": "(V3) To the Moon!"}.
* **/simple/price** : Queries prices of one or more coins using Coin API IDs.
* **/simple/token_price/{id}** : Queries token prices using Coin API IDs.
* **/simple/supported_vs_currencies** : Lists all supported fiat and crypto currencies for comparison.
* **/coins/list** : Provides a list of all supported coins with their ID, name, and symbol. Example response includes "id": "0chain", "symbol": "zcn", "name": "Zus".
* **/coins/markets** : Offers a comprehensive list of coins with price, market cap, volume, and other market-related data. This endpoint allows filtering by IDs, names, symbols, and categories. It returns detailed metrics such as current_price, market_cap, total_volume, high_24h, low_24h, price_change_percentage_24h, circulating_supply, total_supply, max_supply, ath (all time high), and atl (all time low).
* **Quote:** Example data for Bitcoin includes: "current_price": 70187, "market_cap": 1381651251183, "market_cap_rank": 1, "price_change_percentage_24h": 3.12502.
* **/coins/{id}** : Retrieves all metadata for a specific coin ID, including images, websites, social links, description, and contract addresses. This endpoint allows including tickers, market_data, community_data, developer_data, and sparkline in the response.
* **Community Data includes** : facebook_likes, reddit_average_posts_48h, reddit_average_comments_48h, reddit_subscribers, reddit_accounts_active_48h, and telegram_channel_user_count.
* **Developer Data includes** : forks, stars, subscribers, total_issues, closed_issues, pull_requests_merged, pull_request_contributors, and commit_count_4_weeks.
* **/coins/{id}/tickers** : Lists coin tickers from both Centralized Exchanges (CEX) and Decentralized Exchanges (DEX) for a given coin ID.
* **Quote:** For Bitcoin, it shows tickers from various markets like Binance, with details such as last price, volume, cost_to_move_up_usd, trust_score (e.g., "green"), and bid_ask_spread_percentage.
* **Historical Data Endpoints** :
* **/coins/{id}/history** : Retrieves historical data (price, market cap, 24hr volume) for a specific date.
* **/coins/{id}/market_chart** : Provides historical chart data including UNIX time, price, market cap, and 24hr volume.
* **/coins/{id}/market_chart/range** : Similar to market_chart but for a specified time range in UNIX.
* **/coins/{id}/ohlc** : Gets Open, High, Low, Close (OHLC) chart data.
* **Note on Historical Data Granularity and Access** :
* 1 day from current time = 5-minutely data.
* 2-90 days = hourly data.
* Above 90 days = daily data.
* Public API access is limited to the past 365 days; Pro-API is required for full historical data.
* **Contract-based Coin Data** :
* **/coins/../contract/..** : Queries metadata based on asset platform and token contract address.
* **/coins/../contract/../market_chart** : Historical chart data by contract address.
* **/coins/../contract/../market_chart/range** : Historical chart data for a range by contract address.
* **Quote:** USDC contract details are provided across multiple platforms like Ethereum, Polygon-POS, Solana, etc., with their respective contract_address and decimal_place.
* **Categories** :
* **/coins/categories/list** : Lists all coin categories.
* **/coins/categories** : Lists categories with market data (market cap, volume).
* **Quote:** "Layer 1 (L1)" category details include market_cap, market_cap_change_24h, and top_3_coins_id (e.g., "bitcoin", "ethereum", "binancecoin").

### 3.2. NFT Endpoint (Beta)

Provides data on Non-Fungible Tokens.

* **/nfts/list** : Lists supported NFTs with ID, contract address, name, asset platform ID, and symbol.
* **/nfts/..** : Queries NFT collection data (name, floor price, 24hr volume) based on NFT collection ID.
* **/nfts/../contract/..** : Queries NFT data based on contract address and asset platform.
* **Quote:** Pudgy Penguins NFT collection details include contract_address, asset_platform_id (ethereum), name, symbol, floor_price (in native currency and USD), market_cap, and volume_24h.

### 3.3. Exchanges & Derivatives Endpoint

Offers data on cryptocurrency exchanges and derivative markets.

* **/exchanges** : Lists all supported exchanges with data like ID, name, country, description, URL, image, trust score, and 24hr BTC trade volume.
* **Quote:** Examples include Bybit and Coinbase Exchange with their year_established, country, trust_score, and trade_volume_24h_btc.
* **/exchanges/list** : Lists exchanges by ID and name.
* **/exchanges/{id}** : Provides detailed data for a specific exchange, including its volume in BTC and tickers.
* **/exchanges/{id}/tickers** : Queries an exchange's tickers.
* **/exchanges/{id}/volume_chart** : Historical volume chart data for an exchange in BTC.
* **/derivatives** : Lists tickers from derivatives exchanges. This includes market, symbol, index_id, price, price_percentage_change_24h, contract_type, index, basis, spread, funding_rate, open_interest, and volume_24h.
* **Quote:** Examples include ETHUSDT perpetual contract on Deepcoin (Derivatives) with price, open_interest in USD, and volume_24h.
* **/derivatives/exchanges** : Lists derivatives exchanges with related data (ID, name, open interest).
* **/derivatives/exchanges/{id}** : Detailed data for a specific derivatives exchange.
* **/derivatives/exchanges/list** : Lists derivatives exchanges by ID and name.

### 3.4. General Endpoint

Provides overall market insights and utility features.

* **/exchange_rates** : Queries BTC exchange rates with other currencies.
* **/asset_platforms** : Lists all supported asset platforms (blockchain networks).
* **Quote:** Returns platforms like "Polygon POS" with its chain_identifier, shortname (MATIC), and native_coin_id.
* **/search** : Searches for coins, categories, and markets.
* **/search/trending** : Queries trending search coins, NFTs, and categories in the last 24 hours.
* **Quote:** Trending coins include "Moon Tropica" with its market_cap_rank and price_btc.
* **/global** : Retrieves global cryptocurrency data, including active_cryptocurrencies, ongoing_icos, ended_icos, markets, total_market_cap (in various currencies including USD), and market_cap_percentage.
* **Quote:** Global data shows active_cryptocurrencies: 13690, markets: 1046, and total_market_cap in USD: 2721226850772.63.
* **/global/decentralized_finance_defi** : Queries global Decentralized Finance (DeFi) data, such as defi_market_cap, eth_market_cap, defi_to_eth_ratio, trading_volume_24h, defi_dominance, and top_coin_name with its defi_dominance.
* **Quote:** DeFi market cap is 105273842288.229620442228701667, and top_coin_name: "Lido Staked Ether" with top_coin_defi_dominance: 30.589442518868.
* **/companies/public_treasury/{coin_id}** : Provides data on public companies' Bitcoin or Ethereum holdings.
* **Quote:** For Bitcoin, it lists companies like MicroStrategy Inc. with their total_holdings, total_entry_value_usd, total_current_value_usd, and percentage_of_total_supply.

### 3.5. Onchain DEX Endpoints (GeckoTerminal)

Focuses on decentralized exchange (DEX) data, available through GeckoTerminal.

* **/onchain/simple/networks/../token_price/..** : Gets token price based on a token contract address on a specific network, with options to include market cap, 24hr volume, price change, and total reserve in USD.
* **Quote:** Example for Ethereum shows WETH price as 2289.33 with market_cap_usd and h24_volume_usd.
* **/onchain/networks** : Lists all supported networks on GeckoTerminal.
* **Quote:** Includes "Ethereum", "BNB Chain", and "Polygon POS".
* **/onchain/networks/../dexes** : Lists supported DEXs on a given network.
* **Quote:** For Ethereum, lists "Uniswap V2", "SushiSwap", and "Uniswap V3".
* **Pools Data** : A variety of endpoints to query trending, specific, multiple, top, and new pools, along with OHLCV data and recent trades.
* **/onchain/networks/trending_pools** : Trending pools across all networks.
* **/onchain/networks/../trending_pools** : Trending pools on a specific network.
* **/onchain/networks/../pools/..** : Specific pool data by address, including base_token_price_usd, quote_token_price_usd, pool_name, pool_fee_percentage, fdv_usd, price_change_percentage over various timeframes, and transactions.
* **/onchain/networks/../pools/multi/..** : Multiple pools data.
* **/onchain/networks/../pools** : Top pools on a network.
* **/onchain/networks/../dexes/../pools** : Top pools by network and DEX.
* **/onchain/networks/../new_pools** : Latest pools on a network.
* **/onchain/networks/new_pools** : Latest pools across all networks.
* **Token Data** :
* **/onchain/networks/../tokens/../pools** : Top pools for a given token contract address.
* **/onchain/networks/../tokens/..** : Specific token data by contract address, including name, symbol, decimals, total_supply, price_usd, fdv_usd, volume_usd, and market_cap_usd.
* **/onchain/networks/../tokens/multi/..** : Multiple tokens data.
* **/onchain/networks/../tokens/../info** : Token metadata (name, symbol, CoinGecko ID, image, socials, websites, description, GT Score, and  **holders distribution** ).
* **Quote:** USDT token info includes its address, name, symbol, image_url, coingecko_coin_id, websites, description, gt_score, and holders data with count and distribution_percentage (e.g., "top_10": "45.5782").
* **/onchain/tokens/info_recently_updated** : 100 most recently updated token info across all networks.
* **/onchain/networks/../pools/../ohlcv/..** : OHLCV chart data for a pool.
* **/onchain/networks/../pools/../trades** : Last 300 trades in the past 24 hours for a pool, including block_number, tx_hash, from_token_amount, to_token_amount, price_from_in_usd, kind (buy/sell), and volume_in_usd.

## 4. Common Features and Limitations

* **Caching/Update Frequency** : Data refresh rates vary by endpoint. For instance, /coins/{id} market data is updated every 60 seconds, while historical chart data (e.g., /coins/{id}/market_chart) can range from 30 seconds to 12 hours depending on the query range.
* **Rate Limits** : The document mentions a "Common Errors & Rate Limit" section, indicating that there are usage restrictions.
* **Data Granularity** : For historical chart data, granularity automatically adjusts based on the queried date range (e.g., 5-minutely for 1 day, hourly for 2-90 days, daily for over 90 days).
* **Localization** : Many coin data endpoints support localization to include data in various languages.
* **Query Parameters** : Many endpoints offer extensive query parameters to filter, sort, and expand the returned data (e.g., ids, symbols, include_market_cap, order, localization, tickers, market_data, community_data, developer_data, sparkline).
* **Beta Features** : NFTs and some GeckoTerminal features (like holders data) are explicitly marked as Beta, implying ongoing improvements.
* **Deprecated Data** : Reddit and Twitter community data are "no longer supported" in the /coins/{id} endpoint.
* **API ID vs. Contract Address** : Users can obtain coin IDs from the /coins/list endpoint or coin pages. Some endpoints support querying by token contract address in addition to CoinGecko's internal ID.

**Overall, the CoinGecko API offers a comprehensive suite of endpoints for developers and analysts to access a vast array of cryptocurrency, NFT, exchange, and on-chain DEX data, providing both current and historical insights into the digital asset market.**
