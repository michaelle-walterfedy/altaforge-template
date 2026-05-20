import React, { useEffect, useState } from "react";
import { Box, Card, Flex, Heading, Text, Badge } from "altaforge-ui/themes";
import { useHealthCheck } from "@/hooks/useHealthCheck";

function useSecondsSince(timestamp: number | undefined): number | null {
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (timestamp === undefined) {
      setSeconds(null);
      return;
    }
    const tick = () => setSeconds(Math.floor((Date.now() - timestamp) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timestamp]);

  return seconds;
}

const Dashboard: React.FC = () => {
  const { data: health, isLoading, isFetching, isError, dataUpdatedAt } = useHealthCheck();
  const secondsSince = useSecondsSince(dataUpdatedAt || undefined);

  const isConnected = !!health && !isError;
  const isInitialLoad = isLoading && !health;

  let dotColor: string;
  if (isInitialLoad) dotColor = "var(--amber-9)";
  else if (isConnected) dotColor = "var(--green-9)";
  else dotColor = "var(--red-9)";

  let statusText: string;
  if (isInitialLoad) {
    statusText = "Connecting…";
  } else if (isConnected) {
    const ago = secondsSince !== null && secondsSince > 0 ? ` · checked ${secondsSince}s ago` : "";
    statusText = `Connected — v${health.version}${ago}`;
  } else {
    statusText = "Not reachable — running in frontend-only mode";
  }

  return (
    <Flex direction="column" gap="6">
      {/* Hero */}
      <Card size="4" style={{ background: "var(--accent-3)" }}>
        <Flex direction="column" gap="3" p="2">
          <Flex align="center" gap="2">
            <Badge color="cyan" variant="solid" radius="full">
              AltaForge
            </Badge>
          </Flex>
          <Heading size="8" style={{ color: "var(--accent-12)" }}>
            Hello, Agentic World.
          </Heading>
          <Text size="4" style={{ color: "var(--accent-11)" }}>
            The Future Is Agentic. Build something remarkable with AltaForge.
          </Text>
        </Flex>
      </Card>

      {/* Backend connection indicator */}
      <Card size="2" variant="surface">
        <Flex align="center" gap="3">
          <Box style={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}>
            <Box
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: dotColor,
                position: "absolute",
              }}
            />
            {/* Pulsing ring while a background poll is in flight */}
            {isFetching && isConnected && (
              <Box
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: dotColor,
                  position: "absolute",
                  opacity: 0.4,
                  animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite",
                }}
              />
            )}
          </Box>
          <Flex direction="column" gap="1" style={{ flex: 1 }}>
            <Text size="2" weight="medium">
              Backend
            </Text>
            <Text size="1" color="gray">
              {statusText}
            </Text>
          </Flex>
          <Text size="1" color="gray" style={{ flexShrink: 0 }}>
            polling every 15s
          </Text>
        </Flex>
      </Card>

      {/* Getting started guide */}
      <Card size="3" variant="surface">
        <Flex direction="column" gap="3">
          <Heading size="4">Getting started</Heading>
          <Flex direction="column" gap="2">
            {[
              { step: "1", text: "Add routes in src/App.tsx and nav items in src/config/navRoutes.tsx" },
              { step: "2", text: "Create pages in src/pages/ — each page owns its layout" },
              { step: "3", text: "Fetch data in custom hooks (src/hooks/) using TanStack Query" },
              { step: "4", text: "Add API functions in src/api/ and wire up new endpoints in backend/main.py" },
              { step: "5", text: "Browse altaforge-ui components at http://localhost:6006 (run make storybook)" },
            ].map(({ step, text }) => (
              <Flex key={step} gap="3" align="start">
                <Badge color="cyan" radius="full" style={{ flexShrink: 0, marginTop: 2 }}>
                  {step}
                </Badge>
                <Text size="2" color="gray">
                  {text}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};

export default Dashboard;
