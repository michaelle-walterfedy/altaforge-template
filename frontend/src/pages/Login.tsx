import React, { useState } from "react";
import { Box, Card, Flex, Heading, Text, TextField, Button } from "altaforge-ui/themes";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(password);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex align="center" justify="center" style={{ height: "100vh", background: "var(--accent-9)" }}>
      <Card size="4" style={{ minWidth: 320 }}>
        <Flex direction="column" gap="5">
          <Box>
            <Heading size="5">Sign in</Heading>
            <Text size="2" color="gray">
              AltaForge
            </Text>
          </Box>
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
              <TextField.Root
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {error && (
                <Text size="2" color="red">
                  {error}
                </Text>
              )}
              <Button type="submit" color="cyan" loading={loading}>
                Sign in
              </Button>
            </Flex>
          </form>
        </Flex>
      </Card>
    </Flex>
  );
};

export default Login;
