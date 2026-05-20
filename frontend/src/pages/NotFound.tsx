import React from "react";
import { Flex, Heading, Text, Button } from "altaforge-ui/themes";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Flex direction="column" align="center" justify="center" gap="4" style={{ height: "60vh" }}>
      <Heading size="9" color="gray">
        404
      </Heading>
      <Text size="3" color="gray">
        Page not found.
      </Text>
      <Button onClick={() => navigate("/dashboard")} color="cyan">
        Go to Dashboard
      </Button>
    </Flex>
  );
};

export default NotFound;
