# Landing Page Components

## HeroSection

```jsx
import HeroSection from "@/components/HeroSection";
<HeroSection onGetStarted={() => setTab("anchor")} />
```

Bitcoin/Stacks/Celo branding, CTA buttons, responsive headline.

## FeatureGrid

```jsx
import FeatureGrid from "@/components/FeatureGrid";
<FeatureGrid />
```

6-column grid of protocol features with icons.

## HowItWorks

```jsx
import HowItWorks from "@/components/HowItWorks";
<HowItWorks />
```

4-step numbered guide: Select → Hash → Anchor → Verify.

## LiveFeed

```jsx
import LiveFeed from "@/components/LiveFeed";
<LiveFeed limit={5} />
```

Auto-refreshes every 30s with latest anchors from chain.